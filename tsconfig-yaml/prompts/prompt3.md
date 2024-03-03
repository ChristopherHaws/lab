Create a typescript function which meets the following requirements:

Input takes a json object (with nested json objects) and transforms it according to the given rules:

-   The function should take a json object and an array of rules.
-   Each rule is an object with the following properties:
    -   key: a string representing the path to the property in the json object. The path is separated by dots, e.g. "a.b.c".
    -   transform: a function that takes a context object and returns a new value.
        -   The transformer return type is a context object or an array of context objects which multiplies the resulting json objects.
        -   The context object has the following properties:
            -   value: the value of the property at the given path.
            -   withValue: a function that takes a new value and returns a new context object with the new value.
-   The function should return an array of json objects. Each object is the result of applying the rules to the input json object. The rules are applied in the order they are given.

```json
{
	"a": "z1",
	"b": { "y1": "y1_val" },
	"c": ["x1", "x2", { "x3x": "x3x_val" }],
	"d": { "r1": 1, "r2": [2, 1, 4, 3] }
	/* etc */
}
```

```typescript
import jsonFileContent from 'path/to/file.json';
type JsonFileContent = typeof jsonFileContent;
const transformedJsons = transformer<JsonFileContent>(
  JsonFileContent,
  [
    {
      key: 'a',
      transform: ctx => ctx.withValue(ctx.value.toUpperCase()); // Z1
    },
    {
      key: 'a',
      transform: ctx => ctx.withValue(ctx.value + '!'); // Z1!
    },
    {
      key: 'b.y1',
      transform: ctx => [ // array of contexts multiplies the result
        ctx.withValue(ctx.value + 'z'), // y1_valz
        ctx.withValue(ctx.value + 'y'), // y1_valy
      ];
    }
  ]
);
```

should result in:

```json
[
	{
		"a": "Z1!",
		"b": { "y1": "y1_valz" },
		"c": ["x1", "x2", { "x3x": "x3x_val" }],
		"d": { "r1": 1, "r2": [2, 1, 4, 3] }
		/* etc */
	},
	{
		"a": "Z1!",
		"b": { "y1": "y1_valy" },
		"c": ["x1", "x2", { "x3x": "x3x_val" }],
		"d": { "r1": 1, "r2": [2, 1, 4, 3] }
		/* etc */
	}
]
```

<!-- ----------------------------------------------------------------------- -->
<!--                                Response                                 -->
<!-- ----------------------------------------------------------------------- -->

```typescript
// transformer.ts

type TransformContext<T> = {
	value: T;
	withValue: (newValue: T) => TransformContext<T>;
};

type Rule = {
	key: string;
	transform: (
		context: TransformContext<any>,
	) => TransformContext<any> | Array<TransformContext<any>>;
};

function applyTransform<T>(jsonObject: T, rule: Rule): Array<T> {
	const keys = rule.key.split('.');
	const lastKeyIndex = keys.length - 1;

	function applyRule(obj: any, keyIndex: number): any | any[] {
		if (keyIndex === lastKeyIndex) {
			// We've reached the target property
			const context = {
				value: obj[keys[keyIndex]],
				withValue(newValue: any) {
					return { ...context, value: newValue };
				},
			};
			const result = rule.transform(context);
			if (Array.isArray(result)) {
				// If the transform returns an array, we need to create multiple objects
				return result.map((ctx) => ({ ...obj, [keys[keyIndex]]: ctx.value }));
			} else {
				// Otherwise, just update the property
				obj[keys[keyIndex]] = result.value;
				return obj;
			}
		} else {
			// Recursively traverse the object until we reach the target property
			if (!obj[keys[keyIndex]]) return obj; // If the path does not exist, do nothing
			let nextObj = obj[keys[keyIndex]];

			let transformedValue = applyRule(nextObj, keyIndex + 1);

			if (Array.isArray(transformedValue)) {
				// If we get an array of objects back, we need to handle each one separately
				return transformedValue.map((val) => ({
					...obj,
					[keys[keyIndex]]: val,
				}));
			} else {
				// Otherwise, just update the current path and continue
				obj[keys[keyIndex]] = transformedValue;
				return obj;
			}
		}
	}

	const result = applyRule(jsonObject, 0);

	// Ensure that we always return an array of objects even if no multiplication occurred
	return Array.isArray(result) ? result : [result];
}

function transformer<T>(jsonObject: T, rules: Rule[]): Array<T> {
	let results = [jsonObject];

	for (const rule of rules) {
		let newResults = [];
		for (const result of results) {
			newResults.push(...applyTransform(result, rule));
		}
		results = newResults;
	}

	return results;
}

export default transformer;

// Usage example:
// import jsonFileContent from 'path/to/file.json';
// type JsonFileContent = typeof jsonFileContent;
// const transformedJsons = transformer<JsonFileContent>(
//   jsonFileContent,
//   [
//     /* rules as described in the task */
//   ]
// );
```

This TypeScript function `transformer` takes a JSON object and an array of transformation rules and applies them to produce an array of JSON objects. The transformation is done by recursively traversing both the object and the rules. When a transformation function returns an array of contexts, it multiplies out into several objects. The usage example is commented out at the bottom as it depends on importing actual JSON content from a file.
