const TwigAST = require("twig-ast");
const fs = require("fs");
const deepMerge = require("deepmerge");
const twig = require("twig");

let schema = {};

twig.twig({
  path: "template.twig",
  async load(template) {
    schema = render(schema, template.tokens);

    console.log(JSON.stringify(schema, null, 2));
  },
});

function render(o, tokens) {
  tokens.forEach((token) => {
    console.log(token.type);
    if (token.type === "output") {
      // simple variable
      if (token.stack.length === 1) {
        o[token.stack[0].value] = {
          type: "string|boolean|number",
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
        // schema[token.stack[0].value] = convertDotNotationToObject(token.stack);
      }

      render(o, token.stack);
    } else if (token.type === "logic") {
      if (token.token.type === "Twig.logic.type.for") {
        o[token.token.expression[0].value] = getArray(token.token);
      } else if (token.token.type === "Twig.logic.type.include") {
        if (token.token.withStack.length === 1) {
          o[token.token.withStack[0].value] = {
            type: "object|array",
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
  const o = {
    type: "array",
  };
  const item = token.output
    .filter((entry) => entry.type === "output")
    .map((entry) => entry.stack);

  if (item.length > 0) {
    o[token.expression[0].value] = {};

    if (item[0].length > 1) {
      const keys = [];

      item[0].forEach((i) => {
        if (i.type === "Twig.expression.type.variable") {
          keys.push(i.value);
        } else {
          keys.push(i.key);
        }
      });

      o[token.expression[0].value].items = convertDotNotationToObject(keys);
    } else {
      o[token.expression[0].value].items = {
        type: "string|boolean|number",
      };
    }

    return o;
  }

  return render(o, token.output);
}

function convertDotNotationToObject(keys, isInclude) {
  const tempObj = {};

  let container = tempObj;

  keys.forEach((key, i, values) => {
    if (i === values.length - 1) {
      container[key] = {
        type: isInclude
          ? "object|array|string|boolean|number"
          : "string|boolean|number",
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

// fs.readFile("template.twig", "utf-8", (err, res) => {
// const ast = TwigAST.toAST(res);

// render(ast);
// console.log(JSON.stringify(schema, null, 2));
// });

// function render(item) {
//   if (item.type === "ACCESS_CHAIN" || item.type === "VARIABLE") {
//     // console.log(item);
//     if (item.type === "ACCESS_CHAIN") {
//       schema[item.children[0].name] = {
//         type: "object",
//         properties: {},
//       };

//       schema[item.children[0].name].properties[item.children[1].name] = "foo";
//     }
//   }

//   item.children.forEach((child) => {
//     render(child);
//   });
// }
