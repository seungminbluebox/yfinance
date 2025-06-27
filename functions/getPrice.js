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
    // ✅ 1. 주가 가져오기
    const result = await yahooFinance.quote(symbolList);
    const resultsArray = Array.isArray(result) ? result : [result];

    const prices = {};
    resultsArray.forEach((item) => {
      prices[item.symbol] = item.regularMarketPrice;
    });

    // ✅ 2. 환율 가져오기 (USD → KRW)
    const fx = await yahooFinance.quote("USDKRW=X");
    prices["USD_KRW"] = Math.round(fx.regularMarketPrice);

    // ✅ 3. 응답 반환
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(prices),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to fetch price or exchange rate",
        details: err.message,
      }),
    };
  }
};
