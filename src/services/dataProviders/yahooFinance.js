export const name = "Yahoo Finance (mock)";

export async function fetchForSymbol(symbol) {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

  const price = (90 + Math.random() * 180).toFixed(2);
  const change = ((Math.random() - 0.5) * 3).toFixed(2);
  return {
    symbol,
    price: Number(price),
    change: Number(change),
    timestamp: new Date().toISOString(),
  };
}
