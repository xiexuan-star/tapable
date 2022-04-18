// 用于生成最终的执行文件
import { CompilerOptions, Hook } from './hook';

interface ArgsOptions {
  before?: string,
  after?: string
}

export interface ContentContext {
  onError(err: string): string;

  onDone(): string;

  onResult(err: string): string;

  resultReturns: boolean;
  rethrowIfPossible: boolean;
}

function onError(err: string) {
  return `throw ${ err };\n`;
}

function onResult(result: string) {
  return `return ${ result };`;
}

function onDone() {
  return '';
}

export class HookCodeFactory {
  options?: CompilerOptions;
  _args?: string[];

  constructor(public config: any) {
  }

  // 初始化实例中的_x属性
  setup(instance: Hook, options: CompilerOptions) {
    instance._x = options.taps.map(i => i.fn);
  }

  create(options: CompilerOptions): Function {
    // 初始化options
    this.init(options);
    // fn 为最终生成的方法
    let fn: Function;
    switch (options.type) {
      case 'sync':
        fn = new Function(
          this.args(), `
          "use strict";\n
          ${ this.header() }
          ${ this.contentWithInterceptors({
            onError(err: string) {
              return `throw ${ err };\n`;
            },
            onResult(result: string) {
              return `return ${ result };`;
            },
            onDone: () => '',
            resultReturns: true,
            rethrowIfPossible: true
          }) }
          `
        );
        break;
    }
    console.log(fn!.toString());
    return fn!;
  }

  // 序列化args
  args({ before, after }: ArgsOptions = {}) {
    let allArgs = this._args!;
    if (before) allArgs.unshift(before);
    if (after) allArgs.push(after);
    if (allArgs.length) return allArgs.join(',');
    return '';
  }

  init(options: CompilerOptions) {
    this.options = options;
    this._args = options.args.slice();
  }

  header() {
    let code = '';
    code += 'var _x = this._x;\n';
    if (this.options!.interceptors?.length) {
      code += 'var _taps = this.taps;\n';
      code += 'var _interceptors = this.interceptors;\n';
    }
    return code;
  }

  // context codeGen上下文
  contentWithInterceptors(context: ContentContext) {
    if (this.options?.interceptors.length) {
      //
    } else {
      return this.content(context);
    }
    return '';
  }

  content(context: ContentContext) {
    throw new Error('should overwrite content function');
  }

  callTapSeries({ onDone }: Partial<ContentContext>) {
    let code = '';
    let current = onDone!;
    if (!this.options?.taps.length) return current();
    for (let i = this.options.taps.length - 1; i >= 0; i--) {
      const done = current;
      const content = this.callTap(i, { onDone: done });
      current = () => content;
    }
    code += current();
    return code;
  }

  callTap(tapIndex: number, { onDone }: { onDone(): string }) {
    let code = '';
    code += `var _fn${ tapIndex } = ${ this.getTapFn(tapIndex) };\n`;
    const tap = this.options!.taps[tapIndex];
    switch (tap.type) {
      case 'sync':
        code += `_fn${ tapIndex }(${ this.args() });\n`;
        break;
    }
    if (onDone) {
      code += onDone();
    }
    return code;
  }

  getTapFn(idx: number) {
    return `_x[${ idx }]`;
  }
}
