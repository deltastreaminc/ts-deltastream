export class Deferred<T, E> {
  resolve: (value: T | PromiseLike<T>) => void = () => {};
  reject: (reason?: E) => void = () => {};
  promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
