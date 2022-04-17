import { SyncBailHook, SyncHook, SyncLoopHook, SyncWaterfallHook } from 'tapable';

// 最常规的钩子
const syncHook = new SyncHook(['name']);
syncHook.tap('car', (name) => {
  console.log(name + '1');
});
syncHook.tap('car', (name) => {
  console.log(name + '2');
});
syncHook.call('bus');

// 带有保险功能的钩子
const syncBailHook = new SyncBailHook(['name']);
syncBailHook.tap('car', name => {
  console.log(name + '1');
  // bail类型hook一旦有返回值，则后续hook不执行
  return 1;
});
syncBailHook.tap('car', name => {
  console.log(name + '2');
});
syncBailHook.call('bicycle');

// 瀑布流钩子，类似链式调用
const syncWaterfallHook = new SyncWaterfallHook(['name']);
syncWaterfallHook.tap('car', name => {
  if (typeof name !== 'string') return name;
  console.log(name + '1');
  return name + '1';
});
syncWaterfallHook.tap('car', name => {
  if (typeof name !== 'string') return name;
  console.log(name + '2');
  return name + '2';
});
syncWaterfallHook.call('motorbike');

// 循环Hook，当有返回值时，所有hook重新执行知道所有hook都没有返回值
const syncLoopHook = new SyncLoopHook(['name']);
syncLoopHook.tap('car', () => {
  if (Math.random() > 0.5) return 1;
  console.log(1);
});
syncLoopHook.tap('car', () => {
  if (Math.random() > 0.5) return 1;
  console.log(2);
});
syncLoopHook.tap('car', () => {
  if (Math.random() > 0.5) return 1;
  console.log(3);
});
syncLoopHook.call(1);
