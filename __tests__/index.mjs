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
            object2var: {
              type: "boolean|number|string",
            },
            object3: {
              type: "object",
              properties: {
                object3var: {
                  type: "boolean|number|string",
                },
              },
            },
          },
        },
      },
    },
    object4: {
      type: "object",
      properties: {
        object5: {
          type: "object",
          properties: {
            object5var: {
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
    var3: {
      type: "object",
      properties: {
        var31: {
          type: "object",
          properties: {
            var32: {
              type: "array|boolean|number|object|string",
            },
          },
        },
      },
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
    object: {
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
  });
});

test("11", async () => {
  const result = await Validator("__tests__/11.twig");

  expect(result).toEqual({
    variable: {
      type: "boolean|number|string",
    },
    array: {
      type: "array",
      items: {
        type: "boolean|number|string",
      },
    },
  });
});

test("12", async () => {
  const result = await Validator("__tests__/12.twig");

  expect(result).toEqual({
    array: {
      type: "array",
      items: {
        type: "array|object",
      },
    },
  });
});

test("13", async () => {
  const result = await Validator("__tests__/13.twig");

  expect(result).toEqual({
    array: {
      type: "array",
      items: {
        type: "array|boolean|number|object|string",
      },
    },
  });
});

test("14", async () => {
  const result = await Validator("__tests__/14.twig");

  expect(result).toEqual({
    array: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "array|boolean|number|object|string",
          },
        },
      },
    },
  });
});

test("15", async () => {
  const result = await Validator("__tests__/15.twig");

  expect(result).toEqual({
    object: {
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
  });
});

test("16", async () => {
  const result = await Validator("__tests__/16.twig");

  expect(result).toEqual({
    array: {
      type: "array",
      items: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "boolean|number|string",
            },
          },
        },
      },
    },
  });
});

test("17", async () => {
  const result = await Validator("__tests__/17.twig");

  expect(result).toEqual({
    array: {
      type: "array",
      items: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "array|object",
            },
          },
        },
      },
    },
  });
});

test("100", async () => {
  const result = await Validator("__tests__/100.twig");

  expect(result).toEqual({
    var1: {
      type: "boolean|number|string",
    },
    obj1: {
      type: "object",
      properties: {
        var2: {
          type: "boolean|number|string",
        },
      },
    },
    globalVar: {
      type: "array|boolean|number|object|string",
    },
    array1: {
      type: "array",
      items: {
        type: "object",
        properties: {
          var1: {
            type: "boolean|number|string",
          },
          array2: {
            type: "array",
            items: {
              type: "object",
              properties: {
                var1: {
                  type: "boolean|number|string",
                },
                array3: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      array4: {
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
