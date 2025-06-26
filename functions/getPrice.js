// functions/getPrice.js
import yahooFinance from "yahoo-finance2";

export async function handler(event) {
  const symbol = event.queryStringParameters.symbol;
  if (!symbol) {
    return { statusCode: 400, body: "Missing symbol" };
  }

  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(quote),
    };
  } catch (err) {
    console.error("Yahoo Finance Error:", err);
    return { statusCode: 500, body: "Error fetching price" };
  }
}
