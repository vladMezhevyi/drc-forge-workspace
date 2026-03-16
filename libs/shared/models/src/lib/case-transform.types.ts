export type CamelToSnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? `_${Lowercase<Head>}${CamelToSnakeCase<Tail>}`
    : `${Head}${CamelToSnakeCase<Tail>}`
  : S;

export type SnakeToCamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
  : S;

export type DeepCamelCase<T> = T extends unknown[]
  ? DeepCamelCase<T[number]>[]
  : T extends object
    ? { [K in keyof T as SnakeToCamelCase<string & K>]: DeepCamelCase<T[K]> }
    : T;

export type DeepSnakeCase<T> = T extends unknown[]
  ? DeepSnakeCase<T[number]>[]
  : T extends object
    ? { [K in keyof T as CamelToSnakeCase<string & K>]: DeepSnakeCase<T[K]> }
    : T;
