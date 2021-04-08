export type Next = () => void | Promise<void>;

export type Middleware<T> = (context: T, next: Next) => Promise<boolean | void> | boolean | void;

export type Callback = (cancel: boolean | void) => void;
