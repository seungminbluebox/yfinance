const yahooFinance = require("yahoo-finance2").default;

exports.handler = async function (event, context) {
  const { symbol } = event.queryStringParameters;

  if (!symbol) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "symbol is required" }),
    };
  }

  const symbolList = symbol.split(",").map((s) => s.trim());

  try {
    const result = await yahooFinance.quote(symbolList);
    const resultsArray = Array.isArray(result) ? result : [result];

    const prices = {};
    resultsArray.forEach((item) => {
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
