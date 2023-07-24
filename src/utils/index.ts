const intervals: NodeJS.Timer[] = [];
const timeouts: NodeJS.Timeout[] = [];

export const setIntervalWrapper = (callback: () => any, ms: number) => {
  const interval = setInterval(callback, ms);
  intervals.push(interval);
};

export const clearIntervals = () => {
  for (const interval of intervals) {
    clearInterval(interval);
  }
};

export const setTimeoutWrapper = (callback: () => any, ms: number) => {
  const timeout = setTimeout(callback, ms);
  timeouts.push(timeout);
};

export const clearTimeouts = () => {
  for (const timeout of timeouts) {
    clearTimeout(timeout);
  }
};
