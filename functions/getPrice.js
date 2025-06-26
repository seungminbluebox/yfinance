const yahooFinance = require("yahoo-finance2").default;

exports.handler = async function (event, context) {
  const { symbol } = event.queryStringParameters;

  if (!symbol) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "symbol is required" }),
    };
  }

  try {
    const result = await yahooFinance.quote(symbol);
    const data = Array.isArray(result) ? result : [result];

    const prices = {};
    data.forEach((item) => {
      prices[item.symbol] = item.regularMarketPrice;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(prices),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch price",
        details: err.message,
      }),
    };
  }
};
