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
type OrderPaths = Paths<Order>;
type OrderPathStrings = PathStrings<Order>;

type Paths<T> = T extends any[]
	? never
	: T extends object
	? {
			[Key in keyof T]: [Key] | [Key, ...Paths<T[Key]>];
	  }[keyof T]
	: never;

type ToString<T extends Stringable> = T extends string ? T : `${T}`;

type Stringable = string | number | bigint | boolean;

type Join<T extends any[], D extends string> = T extends []
	? never
	: T extends [infer F]
	? ToString<Extract<F, Stringable>>
	: T extends [infer F, ...infer R]
	? `${ToString<Extract<F, Stringable>>}${D}${Join<Extract<R, any[]>, D>}`
	: never;

type PathStrings<T> = Join<Paths<T>, '.'>;
