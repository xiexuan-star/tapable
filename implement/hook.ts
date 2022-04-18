// 所有hook的父类

const DO_NOTHING = () => {
  //
};
const CALL_ASYNC_DELEGATE = DO_NOTHING;
const PROMISE_DELEGATE = DO_NOTHING;

type TapType = 'sync' | 'async' | 'promise';

export interface CompilerOptions {
  taps: TapItem[];
  interceptors: any[];
  args: string[];
  type: TapType;
}

interface TapOptions {
  name: string;
}

interface TapItem {
  type: TapType;
  fn: Function;
  name: string;
}

function CALL_DELEGATE(this: Hook, ...args: any[]): any {
  // 执行call时才需要编译函数(懒编译)
  this.call = this._createCall('sync');
  return this.call(...args);
};

export class Hook {
  tapAsync?: any;
  tapPromise?: any;
  // 已注册的内容
  taps: TapItem[] = [];
  // 已注册的拦截器
  interceptors = [];

  _x: Array<Function> = [];

  _promise: Function = PROMISE_DELEGATE;
  promise: Function = PROMISE_DELEGATE;

  _callAsync: Function = CALL_ASYNC_DELEGATE;
  callAsync: Function = CALL_ASYNC_DELEGATE;

  _call = CALL_DELEGATE;
  call = CALL_DELEGATE;

  constructor(private args: string[] = [], private name?: string) {}

  compiler(options: any): any {
    throw new Error('should implement compiler function in child class');
  }

  tap(options: string | TapOptions, fn: Function) {
    this._tap('sync', options, fn);
  }

  _tap(type: 'async' | 'sync' | 'promise', options: string | TapOptions, fn: Function) {
    if (typeof options === 'string') {
      options = { name: options };
    } else if (!options || typeof options !== 'object') {
      throw new Error('invalid tap options');
    }
    if (!options.name) {
      throw new Error('Missing name for tap');
    }
    options = Object.assign({ type, fn }, options);
    this._insert(options as TapItem);
  }

  _insert(item: TapItem) {
    this._resetCompilation();
    this.taps.push(item);
  }

  _resetCompilation() {
    this.call = this._call;
  }

  _createCall(type: TapType) {
    return this.compiler({
      taps: this.taps,
      interceptors: this.interceptors,
      args: this.args,
      type
    });
  }
}
