import deepMerge from "deepmerge";
import twig from "twig";

export default (path) => {
  const template = twig.twig({
    path,
    async: false,
  });

  return render({}, template.tokens);
};

function render(o, tokens) {
  tokens.forEach((token) => {
    if (token.type === "output") {
      // simple variable
      if (token.stack.length === 1) {
        o[token.stack[0].value] = {
          type: "boolean|number|string",
        };
        // object
      } else {
        const keys = [];

        token.stack.forEach((i) => {
          if (i.type === "Twig.expression.type.variable") {
            keys.push(i.value);
          } else {
            keys.push(i.key);
          }
        });

        o = deepMerge(o, convertDotNotationToObject(keys));
      }

      render(o, token.stack);
    } else if (token.type === "logic") {
      if (token.token.type === "Twig.logic.type.for") {
        o[token.token.expression[0].value] = getArray(token.token);
      } else if (token.token.type === "Twig.logic.type.include") {
        if (token.token.withStack.length === 1) {
          o[token.token.withStack[0].value] = {
            type: "array|object",
          };
        } else {
          const arr = [];

          token.token.withStack.forEach((item) => {
            if (item.type === "Twig.expression.type.variable") {
              arr.push([item.value]);
            } else if (item.type === "Twig.expression.type.key.period") {
              arr[arr.length - 1].push(item.key);
            }
          });

          arr.forEach((item) => {
            o = deepMerge(o, convertDotNotationToObject(item, true));
          });
        }
      }
    }
  });

  return o;
}

function getArray(token) {
  // children are simple variables or objects

  if (token.output.find((entry) => entry.type === "output")) {
    const item = token.output.find((entry) => entry.type === "output");

    // children are simple variables
    if (item.stack.length === 1) {
      return {
        type: "array",
        items: {
          type: "boolean|number|string",
        },
      };
    }

    // children are objects
    const keys = [];

    item.stack.slice(1).forEach((i) => {
      if (i.type === "Twig.expression.type.variable") {
        keys.push(i.value);
      } else {
        keys.push(i.key);
      }
    });

    return {
      type: "array",
      items: {
        type: "object",
        properties: convertDotNotationToObject(keys),
      },
    };
  }

  // children are arrays
  return {
    type: "array",
    items: getArray(token.output[1].token),
  };
}

function convertDotNotationToObject(keys, isInclude) {
  const tempObj = {};

  let container = tempObj;

  keys.forEach((key, i, values) => {
    if (i === values.length - 1) {
      container[key] = {
        type: isInclude
          ? "array|boolean|number|object|string"
          : "boolean|number|string",
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
