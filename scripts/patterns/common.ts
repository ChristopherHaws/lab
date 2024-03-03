/**
 * Represents a non-empty string.
 * @example const name: NonEmptyString = "John Doe";
 */
type NonEmptyString<T extends string> = T extends '' ? never : T;

/**
 * Extracts the inner type of an array.
 * @example const value: UnwrapArray<[1, 2, 3]> = 1 | 2 | 3;
 */
type UnwrapArray<T> = T extends Array<infer Inner> ? UnwrapArray<Inner> : T;

const order = {
	customer: 'John Doe',
	items: ['Apple', 'Banana', 'Orange'],
	address: {
		billing: '123 Main St',
		shipping: '456 Side St',
	},
};

type Order = typeof order;
type OrderPaths = ObjectPaths<Order>;
type OrderPathStrings = ObjectPathStrings<Order>;

/**
 * Generates a union of all possible paths through an object.
 * @example
 * type ExamplePaths = ObjectPaths<{a:{b:string}, c:number}>;
 * // Result would be ["a", "a.b", "c"]
 */
type ObjectPaths<T> = T extends Array<any>
	? never
	: T extends object
	? { [K in keyof T]: [K] | [K, ...ObjectPaths<T[K]>] }[keyof T]
	: never;

/**
 * Converts types to string representation.
 */
type ToString<T> = T extends string | number | bigint | boolean ? `${T}` : never;

/**
 * Joins an array of strings or other convertible types into a single string separated by a delimiter.
 * @example
 * type JoinedString = Join<['a','b','c'], '.'>;
 * // Result would be "a.b.c"
 */
type Join<T, D extends string> = T extends []
	? never
	: T extends [infer F]
	? ToString<F>
	: T extends [infer F, ...infer R]
	? `${ToString<F>}${D}${Join<R, D>}`
	: string;

/**
 * Generates strings representing each path through an object separated by dots.
 */
type ObjectPathStrings<T> = Join<ObjectPaths<T>, '.'>;
