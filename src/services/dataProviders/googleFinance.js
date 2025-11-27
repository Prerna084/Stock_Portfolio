export const name = "Google Finance (mock)";

// Template adapter for Google Finance. By default returns mock data.
// Replace implementation with a real API call or server-side proxy if you have access.
export async function fetchForSymbol(symbol) {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));

  // Mocked values — replace with real fetch when you have an API
  const price = (100 + Math.random() * 150).toFixed(2);
  const change = ((Math.random() - 0.5) * 2).toFixed(2);
  return {
    symbol,
    price: Number(price),
    change: Number(change),
    timestamp: new Date().toISOString(),
  };
}
