let EVENTS = {};
const isFunction = value =>
  value &&
  (Object.prototype.toString.call(value) === "[object Function]" ||
    "function" === typeof value ||
    value instanceof Function);

function emit(event, data) {
  if (!EVENTS[event]) {
    throw new Error(`Can't emit an event. Event "${event}" doesn't exits.`);
  }
  const fireCallbacks = callback => {
    callback(data);
  };
  EVENTS[event].forEach(fireCallbacks);
}
function on(event, listener) {
  if (isFunction(listener)) {
    if (EVENTS[event]) {
      return EVENTS[event].push(listener);
    }
    EVENTS[event] = [listener];
  }
}
const emitter = {
  on,
  emit
};

export function cleanup() {
  EVENTS = {};
}

export default emitter;
