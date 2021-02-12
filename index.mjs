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
      o = deepMerge(o, getOutput(token.stack));
    } else if (token.type === "logic") {
      o = deepMerge(o, getLogic(token.token));
    }
  });

  return o;
}

function getArray(token) {
  let o = {};

  // children are object
  /*if (token.expression.length > 1) {
    const keys = [];

    token.expression.forEach((i) => {
      if (i.type === "Twig.expression.type.variable") {
        keys.push(i.value);
      } else if (i.type === "Twig.expression.type.key.period") {
        keys.push(i.key);
      }
    });
    o = convertDotNotationToObject(keys);
    o[token.expression[0].value] = {
      type: "object",
      items: {
        type: "array",
        properties: convertDotNotationToObject(keys),
      },
    };
    // console.log(JSON.stringify(o, null, 2));
  } else {
    o[token.expression[0].value] = {
      type: "array",
      items: "boolean|number|string",
    };
  }

  return render(o, token.output);*/
  console.log(token);
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

    const keys = [];

    item.stack.forEach((i) => {
      if (i.type === "Twig.expression.type.key.period") {
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

  // if (token.output.find((entry) => entry.type === "logic")) {
  //   const item = token.output.find((entry) => entry.type === "logic");

  //   return {
  //     type: "array",
  //     items: {
  //       type: "object",
  //       properties: convertDotNotationToObject(
  //         item.token.expression
  //           .filter((i) => i.type === "Twig.expression.type.key.period")
  //           .map((i) => i.key),
  //         {
  //           type: "array",
  //         }
  //       ),
  //     },
  //   };
  // }

  // children are arrays

  return {
    type: "array",
    items: getArray(token.output[1].token),
  };
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

function getLogic(token) {
  let o = {};

  if (token.type === "Twig.logic.type.for") {
    o[token.expression[0].value] = getArray(token);
  } else if (token.type === "Twig.logic.type.include") {
    o = getInclude(token);
  }

  return o;
  // return render(o, token.output);
}

function getInclude(token) {
  const o = {};

  if (token.withStack.length === 1) {
    o[token.withStack[0].value] = {
      type: "array|object",
    };
  } else {
    const items = [];

    const entries = token.withStack.filter(
      ({ type }) =>
        type === "Twig.expression.type.variable" ||
        type === "Twig.expression.type.key.period"
    );

    entries.forEach((item) => {
      if (item.type === "Twig.expression.type.variable") {
        items.push({ arr: [] });
        items[items.length - 1].variable = item.value;
      } else if (item.type === "Twig.expression.type.key.period") {
        items[items.length - 1].arr.push(item.key);
      }
    });

    items.forEach((i) => {
      if (i.arr.length > 0) {
        o[i.variable] = {
          properties: convertDotNotationToObject(i.arr, {
            isInclude: true,
          }),
          type: "object",
        };
      } else {
        o[i.variable] = {
          type: "array|boolean|number|object|string",
        };
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
