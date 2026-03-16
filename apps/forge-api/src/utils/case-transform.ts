import * as changeCase from 'change-case';
import type { DeepCamelCase, DeepSnakeCase } from '@drc/shared/models';

export const deepCamelCase = <T>(obj: T): DeepCamelCase<T> => {
  if (Array.isArray(obj)) {
    return obj.map(deepCamelCase) as DeepCamelCase<T>;
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        const nextKey = changeCase.camelCase(key);
        acc[nextKey] = deepCamelCase(value);

        return acc;
      },
      {},
    ) as DeepCamelCase<T>;
  }

  return obj as DeepCamelCase<T>;
};

export const deepSnakeCase = <T>(obj: T): DeepSnakeCase<T> => {
  if (Array.isArray(obj)) {
    return obj.map(deepSnakeCase) as DeepSnakeCase<T>;
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        const nextKey = changeCase.snakeCase(key);
        acc[nextKey] = deepSnakeCase(value);

        return acc;
      },
      {},
    ) as DeepSnakeCase<T>;
  }

  return obj as DeepSnakeCase<T>;
};
