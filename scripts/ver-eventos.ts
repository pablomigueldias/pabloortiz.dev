// Mostra os totais dos últimos 30 dias do dataset de eventos (src/servidor/eventos.ts).
// Uso: CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... node scripts/ver-eventos.ts
// O token precisa da permissão "Account Analytics Read" e fica só no terminal.
const conta = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!conta || !token) {
  console.error(
    "Defina CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_API_TOKEN (permissão Account Analytics Read).",
  );
  process.exit(1);
}

// _sample_interval corrige a amostragem do Analytics Engine: soma ele, e não 1.
const sql = `
  SELECT blob1 AS evento, blob2 AS pagina, blob3 AS origem,
         SUM(_sample_interval) AS total
  FROM pabloortiz_eventos
  WHERE timestamp > NOW() - INTERVAL '30' DAY
  GROUP BY evento, pagina, origem
  ORDER BY total DESC
  FORMAT JSON`;

const resposta = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${conta}/analytics_engine/sql`,
  { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: sql },
);
if (!resposta.ok) {
  console.error(
    `A Cloudflare respondeu ${resposta.status}: ${await resposta.text()}`,
  );
  process.exit(1);
}
const { data } = (await resposta.json()) as {
  data: { evento: string; pagina: string; origem: string; total: number }[];
};
if (data.length === 0) console.log("Nenhum evento nos últimos 30 dias.");
for (const l of data)
  console.log(
    `${String(l.total).padStart(5)}  ${l.evento.padEnd(22)} ${l.pagina || "—"}${l.origem ? `  (origem: ${l.origem})` : ""}`,
  );
export {};
