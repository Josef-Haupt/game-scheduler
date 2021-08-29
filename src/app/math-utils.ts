function range(from: number, to: number) {
  var ar = [];
  for (var i = from; i <= to; i++) {
    ar.push(i);
  }
  return ar;
}

export function nCr(n: number, r: number) {
  if (n < r) {
    return 0;
  }
  var a = range((n - r) + 1, n).reduce(function (x, y) { return x * y; });
  var b = range(1, r).reduce(function (x, y) { return x * y; });
  return a / b;
}
