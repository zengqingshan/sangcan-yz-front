function potoutbase(base = 6) {
  let basedata = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    _base: base,
    _data: "",
  };
  Array(basedata._base)
    .fill(Object.create({}))
    .forEach((e) => {
      let newcheck = Math.ceil(Math.random() * basedata._keyStr.length);
      basedata._data += basedata._keyStr.charAt(newcheck);
    });
  return basedata._data;
  return btoa(basedata._data.match(/^\w*(?=)/));
}

function secondToDate(result) {
  var h = Math.floor(result / 3600);
  var m = Math.floor((result / 60) % 60);
  var s = Math.floor(result % 60);
  return (result = h + "小时" + m + "分钟" + s + "秒");
}

export {
  potoutbase,
  secondToDate,
};
