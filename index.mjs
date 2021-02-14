import deepMerge from "deepmerge";
import twig from "twig";

export default (path) => {
  const template = twig.twig({
    path,
    async: false,
  });

  return render({}, template.tokens);
};

function getDeepestChild(o) {
  let lastChild;

  (function test(obj) {
    if (obj.type === "object") {
      test(obj.properties);
    } else {
      lastChild = obj;
    }
  })(o);

  return lastChild;
}

function render(o, tokens) {
  tokens.forEach((token) => {
    if (token.type === "output") {
      o = deepMerge(o, getOutput(token.stack));
    } else if (token.type === "logic") {
      o = deepMerge(o, getLogic(token.token, true));
    }
  });

  return o;
}

function getArray(token, initial) {
  let o = {};

  // children are simple variables or objects
  if (
    token.output &&
    token.output.find(
      (entry) => entry.type === "output" || entry.type === "logic"
    )
  ) {
    token.output.forEach((item) => {
      if (item.type === "output") {
        // children are simple variables
        if (item.stack.length === 1) {
          // global variable, not the an item of the array
          if (item.stack[0].value !== token.valueVar) {
            o[item.stack[0].value] = {
              type: "boolean|number|string",
            };
            // item of the array
          } else if (initial) {
            o[token.expression[0].value] = {
              type: "array",
              items: {
                type: "boolean|number|string",
              },
            };
          } else {
            o = {
              type: "array",
              items: {
                type: "boolean|number|string",
              },
            };
          }
          // children are objects
        } else {
          const keys = [];

          item.stack.forEach((i) => {
            if (i.type === "Twig.expression.type.key.period") {
              keys.push(i.key);
            }
          });

          // global object, not the an item of the array
          if (item.stack[0].value !== token.valueVar) {
            o[item.stack[0].value] = {
              type: "object",
              properties: convertDotNotationToObject(keys),
            };
            // item of the array
          } else if (initial) {
            o[token.expression[0].value] = {
              type: "array",
              items: {
                type: "object",
                properties: convertDotNotationToObject(keys),
              },
            };
          } else {
            o = {
              type: "array",
              items: {
                type: "object",
                properties: convertDotNotationToObject(keys),
              },
            };
          }
        }
      } else if (item.type === "logic") {
        // if (
        //   item.token.type === "Twig.logic.type.include" &&
        //   item.token.withStack.length === 1
        // ) {
        //   o[token.expression[0].value] = getLogic(item.token, true);
        //   // o = deepMerge(o, getLogic(item.token, true));
        // } else {
        //   o[token.expression[0].value] = {
        //     type: "array",
        //     items: getLogic(item.token, false),
        //   };
        // }

        if (
          item.token.withStack &&
          item.token.withStack.length === 1 &&
          item.token.withStack[0].value !== token.valueVar
        ) {
          o = deepMerge(o, getLogic(item.token, true));
        } else {
          o[token.expression[0].value] = {
            type: "array",
            items: getLogic(item.token, false),
          };
        }
      }
    });

    return o;
  }

  if (initial) {
    o[token.expression[0].value] = {
      type: "array",
      items: getArray(token.output[1].token, false),
    };
  } else {
    o = {
      type: "array",
      items: getArray(token.output[1].token, false),
    };
  }

  return o;
}

function getOutput(stack) {
  const o = {};

  // simple variable
  if (stack.length === 1) {
    o[stack[0].value] = {
      type: "boolean|number|string",
    };
    // object
  } else {
    const keys = [];

    stack.forEach((i) => {
      if (i.type === "Twig.expression.type.key.period") {
        keys.push(i.key);
      }
    });
    o[stack.find((i) => i.type === "Twig.expression.type.variable").value] = {
      properties: convertDotNotationToObject(keys),
      type: "object",
    };
  }

  return o;
}

function getLogic(token, initial) {
  let o = {};

  if (token.type === "Twig.logic.type.for") {
    if (token.expression.length > 1) {
      let deepestChild;
      if (initial) {
        o = convertDotNotationToObject(
          token.expression.map((entry) => entry.value || entry.key),
          { type: "array" }
        );

        deepestChild = getDeepestChild(o[token.expression[0].value]);
      } else {
        o = {
          type: "object",
          properties: convertDotNotationToObject(
            token.expression.map((entry) => entry.value || entry.key).slice(1),
            { type: "array" }
          ),
        };

        deepestChild = getDeepestChild(o);
      }

      deepestChild[Object.keys(deepestChild)[0]] =
        getArray(token, initial)[token.expression[0].value] ||
        getArray(token, initial);
    } else {
      o = getArray(token, initial);
    }
  } else if (token.type === "Twig.logic.type.include") {
    o = getInclude(token, initial);
  }

  return o;
}

function getInclude(token, initial) {
  let o = {};

  if (token.withStack.length === 1) {
    if (initial) {
      o[token.withStack[0].value] = {
        type: "object",
      };
    } else {
      o = {
        type: "object",
      };
    }
  } else {
    const items = [];

    const entries = token.withStack.filter(
      ({ type }) =>
        type === "Twig.expression.type.variable" ||
        type === "Twig.expression.type.key.period"
    );

    entries.forEach((item) => {
      if (item.type === "Twig.expression.type.variable") {
        items.push([]);
        items[items.length - 1].push(item.value);
      } else {
        items[items.length - 1].push(item.key);
      }
    });

    items.forEach((i) => {
      if (i.length > 0) {
        if (i.length > 1) {
          if (initial) {
            o[i[0]] = {
              properties: convertDotNotationToObject(i.slice(1), {
                isInclude: true,
              }),
              type: "object",
            };
          } else {
            o = {
              properties: convertDotNotationToObject(i.slice(1), {
                isInclude: true,
              }),
              type: "object",
            };
          }
        } else if (initial) {
          o[i[0]] = {
            type: "array|boolean|number|object|string",
          };
        } else {
          o = {
            type: "array|boolean|number|object|string",
          };
        }
      }
    });
  }

  return o;
}

function convertDotNotationToObject(keys, { isInclude, type } = {}) {
  const tempObj = {};

  let container = tempObj;

  keys.forEach((key, i, values) => {
    if (i === values.length - 1) {
      container[key] = {
        type:
          type ||
          (isInclude
            ? "array|boolean|number|object|string"
            : "boolean|number|string"),
      };
    } else {
      container[key] = {
        type: "object",
        properties: {},
      };
    }

    container = container[key].properties;
  });

  return tempObj;
}
