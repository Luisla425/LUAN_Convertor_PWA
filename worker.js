export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const today = new Date().toISOString().slice(0, 10);

    if (path === "/rates/today") {
      const binance = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=VES"
      ).then(r => r.json());

      const data = {
        date: today,
        BINANCE: Number(binance.rates.VES.toFixed(2))
      };

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response("Epic Converter Worker ⚡", { status: 200 });
  }
};
