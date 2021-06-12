export interface TaskEntry {
  key: any;
  fn: any;
  timeout: any;
  busy: boolean;
  interval?: NodeJS.Timeout
}

let registerEntries: TaskEntry[] = [];

export function registerTask(key: any, fn: () => Promise<void>, timeout: number) {
  if (registerEntries.find(entry => entry.key === key)) {
    return;
  }

  const entry: TaskEntry = {
    key: key,
    fn: fn,
    timeout: timeout,
    busy: false
  };

  registerEntries.push(entry);

  const wrappedFn = () => {
    if (entry.busy) {
      return;
    }
    entry.busy = true;
    fn().finally(
      () => { entry.busy = false; }
    );
  }
  
  entry.interval = setInterval(wrappedFn, timeout);
  wrappedFn();
}

export function unregisterTask(key: any) {
  const entry = registerEntries.find(e => e.key === key);

  if (entry) {
    registerEntries = registerEntries.filter(e => e !== entry);
  }

  if (entry?.interval) {
    clearInterval(entry.interval);
  }
}
