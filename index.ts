import {
  AsyncParallelBailHook,
  AsyncParallelHook,
  AsyncSeriesBailHook, AsyncSeriesHook, AsyncSeriesWaterfallHook, HookMap, SyncBailHook, SyncHook, SyncLoopHook,
  SyncWaterfallHook
} from 'tapable';

// ------------------------------------ 同步Hook ---------------------------------
// 最常规的钩子
const syncHook = new SyncHook(['name']);
syncHook.tap('car', (name) => {
  console.log(name + '1');
});
syncHook.tap('car', (name) => {
  console.log(name + '2');
});
syncHook.call('bus');
console.log(syncHook)
//
// // 带有保险功能的钩子
// const syncBailHook = new SyncBailHook(['name']);
// syncBailHook.tap('car', name => {
//   console.log(name + '1');
//   // bail类型hook一旦有返回值，则后续hook不执行
//   return 1;
// });
// syncBailHook.tap('car', name => {
//   console.log(name + '2');
// });
// syncBailHook.call('bicycle');
//
// // 瀑布流钩子，类似链式调用
// const syncWaterfallHook = new SyncWaterfallHook(['name']);
// syncWaterfallHook.tap('car', name => {
//   if (typeof name !== 'string') return name;
//   console.log(name + '1');
//   return name + '1';
// });
// syncWaterfallHook.tap('car', name => {
//   if (typeof name !== 'string') return name;
//   console.log(name + '2');
//   return name + '2';
// });
// syncWaterfallHook.call('motorbike');
//
// // 循环Hook，当有返回值时，所有hook重新执行直到所有hook都没有返回值
// const syncLoopHook = new SyncLoopHook(['name']);
// syncLoopHook.tap('car', () => {
//   if (Math.random() > 0.5) return 1;
//   console.log(1);
// });
// syncLoopHook.tap('car', () => {
//   if (Math.random() > 0.5) return 1;
//   console.log(2);
// });
// syncLoopHook.tap('car', () => {
//   if (Math.random() > 0.5) return 1;
//   console.log(3);
// });
// syncLoopHook.call(1);
//
// // ------------------------------------ 异步Hook ---------------------------------
// const asyncSeriesHook = new AsyncSeriesHook(['name']);
// // callback采用的时err-first风格的错误机制
// asyncSeriesHook.tapAsync('car', (name, callback) => {
//   setTimeout(() => {
//     console.log(name + '1');
//     callback();
//   }, 100);
// });
// asyncSeriesHook.tapAsync('car', (name, callback) => {
//   setTimeout(() => {
//     console.log(name + '2');
//     callback();
//   }, 100);
// });
// asyncSeriesHook.tapPromise('car', name => {
//   return new Promise<any>(resolve => {
//     setTimeout(() => {
//       resolve(name);
//     }, 500);
//   });
// });
// console.time('asyncSeriesHook');
// asyncSeriesHook.callAsync('ambulance', () => {
//   console.timeEnd('asyncSeriesHook');
// });
//
// const asyncSeriesBailHook = new AsyncSeriesBailHook(['name']);
// // 同asyncSeriesHook,但当hook返回了非空值时,会中断后续钩子执行
// asyncSeriesBailHook.tapAsync('car', (name, callback) => {
//   setTimeout(() => {
//     console.log(name + '1');
//     callback(null);
//   }, 100);
// });
// asyncSeriesBailHook.tapPromise('car', name => {
//   return new Promise<any>(resolve => {
//     setTimeout(() => {
//       console.log(name + '2');
//       resolve(name);
//     }, 500);
//   });
// });
// asyncSeriesBailHook.tapPromise('car', name => {
//   return new Promise<any>(resolve => {
//     setTimeout(() => {
//       console.log(name + '3');
//       resolve(name);
//     }, 500);
//   });
// });
// console.time('asyncSeriesBailHook');
// asyncSeriesBailHook.callAsync('truck', () => {
//   console.timeEnd('asyncSeriesBailHook');
// });
//
// const asyncSeriesWaterfallHook = new AsyncSeriesWaterfallHook(['name']);
// asyncSeriesWaterfallHook.tapAsync('car', (name, callback) => {
//   setTimeout(() => {
//     console.log(name + '1');
//     callback(null, name + '1');
//   }, 100);
// });
// asyncSeriesWaterfallHook.tapPromise('car', name => {
//   return new Promise<any>(resolve => {
//     setTimeout(() => {
//       console.log(name + '2');
//       resolve(name);
//     }, 500);
//   });
// });
// console.time('asyncSeriesWaterfallHook');
// asyncSeriesWaterfallHook.promise('tank').then(() => {
//   console.timeEnd('asyncSeriesWaterfallHook');
// });
//
// const asyncParallelHook = new AsyncParallelHook(['name']);
// asyncParallelHook.tapPromise('car', name => new Promise<void>(
//   resolve => {
//     setTimeout(() => {
//       console.log(name + '1');
//       resolve();
//     }, 510);
//   }
// ));
// asyncParallelHook.tapPromise('car', name => new Promise<void>(
//   resolve => {
//     setTimeout(() => {
//       console.log(name + '2');
//       resolve();
//     }, 500);
//   }
// ));
//
// console.time('asyncParallelHook');
// asyncParallelHook.promise('airplane').then(() => {
//   console.timeEnd('asyncParallelHook');
// });
//
// const asyncParallelBailHook = new AsyncParallelBailHook(['name']);
// asyncParallelBailHook.tapPromise('car', name => new Promise(
//   resolve => {
//     setTimeout(() => {
//       console.log(name + '1');
//       resolve(true);
//     }, 510);
//   }
// ));
// asyncParallelBailHook.tapPromise('car', name => new Promise<void>(
//   resolve => {
//     setTimeout(() => {
//       console.log(name + '2');
//       resolve();
//     }, 1000);
//   }
// ));
//
// console.time('asyncParallelBailHook');
// asyncParallelBailHook.promise('bullet train').then(() => {
//   console.timeEnd('asyncParallelBailHook');
// });

// ------------------------------------ interceptor ---------------------------------
// tapable 中所有hook中都支持interceptor
// const interceptorHook = new SyncHook(['name']);
// interceptorHook.intercept({
//   register(tapInfo) {
//     console.log('tapInfo=>', tapInfo);
//     const oldFn = tapInfo.fn;
//     tapInfo.fn = (name: string) => oldFn(name + '1');
//     // 修改后返回tapInfo，可以修改tap的行为
//     return tapInfo;
//   },
//   call(name: string) {
//     console.log('call=>', name);
//   },
//   tap: tapInfo => {
//     console.log('tap=>', tapInfo);
//     const oldFn = tapInfo.fn;
//     // 此处修改tapInfo不会生效
//     tapInfo.fn = (name: string) => oldFn(name + '2');
//     return tapInfo;
//   },
//   loop(name: string) {
//     // 仅loop类hook触发
//     console.log('loop=>', name);
//   }
// });
// // stage同样用于调整顺序，数字越小越早，但不会早于before
// interceptorHook.tap({ name: 'car', stage: 1 }, name => {
//   console.log('first=>', name);
// });
// // before属性用于调整执行顺序
// interceptorHook.tap({ name: 'car', before: 'car' }, name => {
//   console.log('second=>', name);
// });
// interceptorHook.tap({ name: 'car', stage: 0 }, name => {
//   console.log('third=>', name);
// });
// interceptorHook.call('ship');

// ------------------------------------ HookMap ---------------------------------
// const keyedHook = new HookMap(() => new SyncHook(['name']));
// keyedHook.intercept({
//   // factory interceptor 为for函数创建hook时自定义添加额外内容
//   factory: (key, hook) => {
//     console.log(key, hook);
//     if (hook) return hook;
//     return new SyncHook(['name']);
//   }
// });
// keyedHook.for('hookKey1').tap('car', name => console.log(name));
// keyedHook.for('hookKey2').tap('car', name => console.log(name));
// keyedHook.for('hookKey3').tap('car', name => console.log(name));
