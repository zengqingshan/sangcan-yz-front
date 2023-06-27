export default function debounce(fun, timer = 100) {
  let time;
  return (...arg) => {
    if (time) clearTimeout(time);
    time = setTimeout(() => {
      fun(arg);
    }, timer);
  };
}
