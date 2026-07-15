export function chunkArray(
  array: any[],
  size: number
) {

  const chunks = [];

  for (
    let i = 0;
    i < array.length;
    i += size
  ) {

    chunks.push(
      array.slice(i, i + size)
    );

  }

  return chunks;

}