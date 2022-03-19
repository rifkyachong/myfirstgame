Array.prototype.multiIndexOf = function (value) {
  var result;
  this.some(
    (function iter(path) {
      return function (a, i) {
        if (a === value) {
          result = path.concat(i);
          return true;
        }
        return Array.isArray(a) && a.some(iter(path.concat(i)));
      };
    })([])
  );
  return result;
};

// var testArray = [
//   true,
//   "",
//   [1, { a: 2, b: [3, false] }, [2, []], null],
//   4,
//   undefined,
//   [5, "test"],
//   function () {},
// ];

// console.log(testArray.multiIndexOf(null));
// console.log([1, [2, 3, 4], 5, [6, [7, 8], 9, 10], 11, 12].multiIndexOf(3));
