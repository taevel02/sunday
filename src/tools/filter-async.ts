export const filterAsync = async <T>(
  array: T[],
  asyncPredicate: (item: T) => Promise<Boolean>
): Promise<T[]> => {
  const verdicts = await Promise.all(array.map(asyncPredicate))
  return array.filter((_, index) => verdicts[index])
}
