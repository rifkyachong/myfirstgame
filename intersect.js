const areIntersected = (lineA, lineB) => {
  let [[Xo_a, Yo_a], [X_a, Y_a]] = lineA;
  let [[Xo_b, Yo_b], [X_b, Y_b]] = lineB;

  // Ax + By = C
  let [A_1, B_1, C_1] = [
    Y_a - Yo_a,
    X_a - Xo_a,
    (Y_a - Yo_a) * Xo_a + (X_a - Xo_a) * Yo_a,
  ];
  let [A_2, B_2, C_2] = [
    Y_b - Yo_b,
    X_b - Xo_b,
    (Y_b - Yo_b) * Xo_b + (X_b - Xo_b) * Yo_b,
  ];

  let Denominator = A_1 * B_2 - A_2 * B_1;

  if (Denominator == 0) {
    return false;
  }

  let [X, Y] = [
    (B_2 * C_1 - B_1 * C_2) / Denominator,
    (A_1 * C_2 - A_2 * C_1) / Denominator,
  ];

  [Xo_a, X_a] = [Math.min(Xo_a, X_a), Math.max(Xo_a, X_a)];
  [Xo_b, X_b] = [Math.min(Xo_b, X_b), Math.max(Xo_b, X_b)];

  if (
    Xo_a <= X &&
    X <= X_a &&
    Xo_b <= X &&
    X <= X_b &&
    Yo_a <= Y &&
    Y <= Y_a &&
    Yo_b <= Y &&
    Y <= Y_b
  ) {
    return true;
  }

  return false;
};

console.log(
  areIntersected(
    [
      [0, 0],
      [1, 0],
    ],
    [
      [1, 0],
      [1, 1],
    ]
  )
);
