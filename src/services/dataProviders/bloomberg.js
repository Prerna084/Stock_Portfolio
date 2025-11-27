export const name = "Bloomberg (mock)";

export async function fetchForSymbol(symbol) {
  await new Promise((r) => setTimeout(r, 250 + Math.random() * 250));

  const price = (110 + Math.random() * 120).toFixed(2);
  const change = ((Math.random() - 0.5) * 1.5).toFixed(2);
  return {
    symbol,
    price: Number(price),
    change: Number(change),
    timestamp: new Date().toISOString(),
  };
}
