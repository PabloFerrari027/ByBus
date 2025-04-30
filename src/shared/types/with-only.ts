export type WithOnly<K extends keyof T, T> = Partial<Omit<T, K>> & Pick<T, K>;
