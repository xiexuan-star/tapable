import { SyncHook } from './syncHook';

const syncHook = new SyncHook(['name']);
syncHook.tap('car', (name: string) => {
  console.log(name + '1');
});
syncHook.tap('car', (name: string) => {
  console.log(name + '2');
});
syncHook.call('bus');
