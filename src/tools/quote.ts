/**
 *
 * @param TDD_CLSPRC 종가
 */
export const 호가가격단위 = (TDD_CLSPRC: string): number => {
  const price = Number(TDD_CLSPRC);

  if (price < 1000) return 1;
  else if (price >= 1000 && price < 2000) return 1;
  else if (price >= 2000 && price < 5000) return 5;
  else if (price >= 5000 && price < 10000) return 10;
  else if (price >= 10000 && price < 20000) return 10;
  else if (price >= 20000 && price < 50000) return 50;
  else if (price >= 50000 && price < 100000) return 100;
  else if (price >= 100000 && price < 200000) return 100;
  else if (price >= 200000 && price < 500000) return 500;
  else if (price >= 500000) return 1000;
  else return 0;
};
