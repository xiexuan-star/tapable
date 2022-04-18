// 同步基础🪝
import { CompilerOptions, Hook } from './hook';
import { ContentContext, HookCodeFactory } from './hookCodeFactory';

const TAP_ASYNC = () => {
  throw new Error('tapAsync is not supported on a SyncHook');
};

const TAP_PROMISE = () => {
  throw new Error('tapPromise is not supported on a SyncHook');
};

export class SyncHook extends Hook {
  tapAsync = TAP_ASYNC;
  tapPromise = TAP_PROMISE;
  compiler = COMPILER;
}

class SyncHookCodeFactory extends HookCodeFactory {
  content({ onError, onDone, rethrowIfPossible }: ContentContext) {
    return this.callTapSeries({
      onError: (err: string) => onError(err),
      onDone,
      rethrowIfPossible,
    });
  }
}

const factory = new SyncHookCodeFactory({});

function COMPILER(this: SyncHook, options: CompilerOptions) {
  factory.setup(this, options);
  return factory.create(options);
}
