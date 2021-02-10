import Validator from "../index.mjs";

test("01", async () => {
  const result = await Validator("__tests__/01.twig");

  expect(result).toEqual({
    variable: {
      type: "boolean|number|string",
    },
  });
});

test("02", async () => {
  const result = await Validator("__tests__/02.twig");

  expect(result).toEqual({
    object1: {
      type: "object",
      properties: {
        object2: {
          type: "object",
          properties: {
            object3var: {
              type: "boolean|number|string",
            },
          },
        },
      },
    },
  });
});

test("03", async () => {
  const result = await Validator("__tests__/03.twig");

  expect(result).toEqual({
    simpleArray: {
      type: "array",
      items: {
        type: "boolean|number|string",
      },
    },
  });
});

test("04", async () => {
  const result = await Validator("__tests__/04.twig");

  expect(result).toEqual({
    objectArray: {
      type: "array",
      items: {
        type: "object",
        properties: {
          objectArrayObjectItem: {
            type: "boolean|number|string",
          },
        },
      },
    },
  });
});

test("05", async () => {
  const result = await Validator("__tests__/05.twig");

  expect(result).toEqual({
    objectArray2: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "boolean|number|string",
        },
      },
    },
  });
});

test("06", async () => {
  const result = await Validator("__tests__/06.twig");

  expect(result).toEqual({
    objectArray3: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            item: {
              type: "boolean|number|string",
            },
          },
        },
      },
    },
  });
});

test("07", async () => {
  const result = await Validator("__tests__/07.twig");

  expect(result).toEqual({
    var1: {
      type: "array|object",
    },
  });
});

test("08", async () => {
  const result = await Validator("__tests__/08.twig");

  expect(result).toEqual({
    var2: {
      type: "array|boolean|number|object|string",
    },
  });
});

test("09", async () => {
  const result = await Validator("__tests__/09.twig");

  expect(result).toEqual({
    var3: {
      type: "object",
      properties: {
        var3item: {
          type: "object",
          properties: {
            item: {
              type: "array|boolean|number|object|string",
            },
          },
        },
      },
    },
  });
});

test("10", async () => {
  const result = await Validator("__tests__/10.twig");

  expect(result).toEqual({
    arr1: {
      type: "array",
      items: {
        type: "object",
        properties: {
          array: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item: {
                  type: "boolean|number|string",
                },
                array: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      array: {
                        type: "array",
                        items: {
                          type: "boolean|number|string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
});
