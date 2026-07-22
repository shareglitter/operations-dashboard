import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

const RAW_DATA = {"generated":"2026-07-22","total_records":49459,"months":[{"month":"2021-09","core_cleans":34,"proj_cleans":0,"total_cleans":34,"revenue":1700,"cogs":850,"gross_margin":850,"gm_pct":50.0,"bags_total":0,"bags_trash":0,"bags_debris":0,"scored_pct":0.0,"projects":{}},{"month":"2021-10","core_cleans":107,"proj_cleans":0,"total_cleans":107,"revenue":5275.0,"cogs":2675,"gross_margin":2600.0,"gm_pct":49.3,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2021-11","core_cleans":94,"proj_cleans":0,"total_cleans":94,"revenue":4640.0,"cogs":2350,"gross_margin":2290.0,"gm_pct":49.4,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2021-12","core_cleans":110,"proj_cleans":0,"total_cleans":110,"revenue":5425.0,"cogs":2750,"gross_margin":2675.0,"gm_pct":49.3,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-01","core_cleans":114,"proj_cleans":0,"total_cleans":114,"revenue":5590.0,"cogs":2850,"gross_margin":2740.0,"gm_pct":49.0,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-02","core_cleans":106,"proj_cleans":0,"total_cleans":106,"revenue":5302.5,"cogs":2700,"gross_margin":2602.5,"gm_pct":49.1,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-03","core_cleans":162,"proj_cleans":0,"total_cleans":162,"revenue":8237.5,"cogs":4175.0,"gross_margin":4062.5,"gm_pct":49.3,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-04","core_cleans":153,"proj_cleans":0,"total_cleans":153,"revenue":7815.0,"cogs":3962.5,"gross_margin":3852.5,"gm_pct":49.3,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-05","core_cleans":220,"proj_cleans":0,"total_cleans":220,"revenue":12317.5,"cogs":5675.0,"gross_margin":6642.5,"gm_pct":53.9,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-06","core_cleans":292,"proj_cleans":0,"total_cleans":292,"revenue":15737.5,"cogs":7525.0,"gross_margin":8212.5,"gm_pct":52.2,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-07","core_cleans":264,"proj_cleans":0,"total_cleans":264,"revenue":13927.5,"cogs":6775.0,"gross_margin":7152.5,"gm_pct":51.4,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-08","core_cleans":336,"proj_cleans":0,"total_cleans":336,"revenue":18000.0,"cogs":8600.0,"gross_margin":9400.0,"gm_pct":52.2,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-09","core_cleans":305,"proj_cleans":0,"total_cleans":305,"revenue":16262.5,"cogs":7825.0,"gross_margin":8437.5,"gm_pct":51.9,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-10","core_cleans":434,"proj_cleans":0,"total_cleans":434,"revenue":22777.5,"cogs":11025.0,"gross_margin":11752.5,"gm_pct":51.6,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-11","core_cleans":298,"proj_cleans":0,"total_cleans":298,"revenue":15730.0,"cogs":7637.5,"gross_margin":8092.5,"gm_pct":51.4,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2022-12","core_cleans":328,"proj_cleans":0,"total_cleans":328,"revenue":17600.0,"cogs":8512.5,"gross_margin":9087.5,"gm_pct":51.6,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2023-01","core_cleans":356,"proj_cleans":0,"total_cleans":356,"revenue":19177.5,"cogs":9200.0,"gross_margin":9977.5,"gm_pct":52.0,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2023-02","core_cleans":359,"proj_cleans":0,"total_cleans":359,"revenue":19165.0,"cogs":9287.5,"gross_margin":9877.5,"gm_pct":51.5,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2023-03","core_cleans":468,"proj_cleans":0,"total_cleans":468,"revenue":24733.75,"cogs":12125.0,"gross_margin":12608.75,"gm_pct":51.0,"bags_total":0,"scored_pct":0.0,"projects":{}},{"month":"2023-04","core_cleans":431,"proj_cleans":8,"total_cleans":439,"revenue":23186.25,"cogs":11325.0,"gross_margin":11861.25,"gm_pct":51.2,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":8}},{"month":"2023-05","core_cleans":512,"proj_cleans":37,"total_cleans":549,"revenue":28907.5,"cogs":14175.0,"gross_margin":14732.5,"gm_pct":51.0,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":37}},{"month":"2023-06","core_cleans":531,"proj_cleans":41,"total_cleans":572,"revenue":30288.75,"cogs":14737.5,"gross_margin":15551.25,"gm_pct":51.3,"bags_total":0,"scored_pct":0.0,"projects":{"SSW":6,"Area32":35}},{"month":"2023-07","core_cleans":502,"proj_cleans":50,"total_cleans":552,"revenue":29107.5,"cogs":14175.0,"gross_margin":14932.5,"gm_pct":51.3,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":32,"SSW":9,"WPNA":9}},{"month":"2023-08","core_cleans":562,"proj_cleans":60,"total_cleans":622,"revenue":32838.75,"cogs":16087.5,"gross_margin":16751.25,"gm_pct":51.0,"bags_total":0,"scored_pct":0.0,"projects":{"WPNA":12,"Area32":39,"SSW":9}},{"month":"2023-09","core_cleans":542,"proj_cleans":52,"total_cleans":594,"revenue":31692.5,"cogs":15375.0,"gross_margin":16317.5,"gm_pct":51.5,"bags_total":0,"scored_pct":0.0,"projects":{"SSW":8,"Area32":32,"WPNA":12}},{"month":"2023-10","core_cleans":527,"proj_cleans":59,"total_cleans":586,"revenue":31370.0,"cogs":15250.0,"gross_margin":16120.0,"gm_pct":51.4,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":37,"WPNA":15,"SSW":7}},{"month":"2023-11","core_cleans":549,"proj_cleans":51,"total_cleans":600,"revenue":31913.75,"cogs":15587.5,"gross_margin":16326.25,"gm_pct":51.2,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":35,"WPNA":12,"SSW":4}},{"month":"2023-12","core_cleans":547,"proj_cleans":57,"total_cleans":604,"revenue":32192.5,"cogs":15625.0,"gross_margin":16567.5,"gm_pct":51.5,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":32,"SSW":13,"WPNA":12}},{"month":"2024-01","core_cleans":571,"proj_cleans":67,"total_cleans":638,"revenue":33932.5,"cogs":16537.5,"gross_margin":17395.0,"gm_pct":51.3,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":43,"SSW":9,"WPNA":15}},{"month":"2024-02","core_cleans":572,"proj_cleans":96,"total_cleans":668,"revenue":35195.0,"cogs":17250.0,"gross_margin":17945.0,"gm_pct":51.0,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":84,"WPNA":12}},{"month":"2024-03","core_cleans":593,"proj_cleans":92,"total_cleans":685,"revenue":36188.75,"cogs":17662.5,"gross_margin":18526.25,"gm_pct":51.2,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":80,"WPNA":12}},{"month":"2024-04","core_cleans":610,"proj_cleans":101,"total_cleans":711,"revenue":37282.5,"cogs":18300.0,"gross_margin":18982.5,"gm_pct":50.9,"bags_total":0,"scored_pct":0.0,"projects":{"WPNA":14,"Area32":87}},{"month":"2024-05","core_cleans":594,"proj_cleans":105,"total_cleans":699,"revenue":36682.5,"cogs":18000.0,"gross_margin":18682.5,"gm_pct":50.9,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":93,"WPNA":12}},{"month":"2024-06","core_cleans":549,"proj_cleans":92,"total_cleans":641,"revenue":33998.75,"cogs":16550.0,"gross_margin":17448.75,"gm_pct":51.3,"bags_total":0,"scored_pct":0.0,"projects":{"WPNA":12,"Area32":80}},{"month":"2024-07","core_cleans":711,"proj_cleans":118,"total_cleans":829,"revenue":43270.0,"cogs":21312.5,"gross_margin":21957.5,"gm_pct":50.7,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":87,"TCB South St":16,"WPNA":15}},{"month":"2024-08","core_cleans":741,"proj_cleans":123,"total_cleans":864,"revenue":45276.25,"cogs":22225.0,"gross_margin":23051.25,"gm_pct":50.9,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":93,"WPNA":12,"TCB South St":18}},{"month":"2024-09","core_cleans":697,"proj_cleans":111,"total_cleans":808,"revenue":41882.5,"cogs":20812.5,"gross_margin":21070.0,"gm_pct":50.3,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":80,"WPNA":12,"TCB South St":19}},{"month":"2024-10","core_cleans":743,"proj_cleans":111,"total_cleans":854,"revenue":43970.0,"cogs":21937.5,"gross_margin":22032.5,"gm_pct":50.1,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":85,"TCB South St":18,"WPNA":8}},{"month":"2024-11","core_cleans":724,"proj_cleans":106,"total_cleans":830,"revenue":43457.5,"cogs":21487.5,"gross_margin":21970.0,"gm_pct":50.6,"bags_total":0,"scored_pct":0.0,"projects":{"TCB South St":19,"Area32":79,"WPNA":8}},{"month":"2024-12","core_cleans":799,"proj_cleans":120,"total_cleans":919,"revenue":48198.75,"cogs":23812.5,"gross_margin":24386.25,"gm_pct":50.6,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":87,"TCB South St":23,"WPNA":10}},{"month":"2025-01","core_cleans":821,"proj_cleans":121,"total_cleans":942,"revenue":49370.0,"cogs":24375.0,"gross_margin":24995.0,"gm_pct":50.6,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":93,"TCB South St":20,"WPNA":8}},{"month":"2025-02","core_cleans":727,"proj_cleans":100,"total_cleans":827,"revenue":43495.0,"cogs":21437.5,"gross_margin":22057.5,"gm_pct":50.7,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":74,"WPNA":8,"TCB South St":18}},{"month":"2025-03","core_cleans":744,"proj_cleans":124,"total_cleans":868,"revenue":46013.75,"cogs":22650.0,"gross_margin":23363.75,"gm_pct":50.8,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":80,"TCB South St":19,"WPNA":25}},{"month":"2025-04","core_cleans":729,"proj_cleans":128,"total_cleans":857,"revenue":45370.0,"cogs":22350.0,"gross_margin":23020.0,"gm_pct":50.7,"bags_total":0,"scored_pct":0.0,"projects":{"TCB South St":20,"Area32":87,"WPNA":20,"SSW":1}},{"month":"2025-05","core_cleans":737,"proj_cleans":141,"total_cleans":878,"revenue":46507.5,"cogs":22887.5,"gross_margin":23620.0,"gm_pct":50.8,"bags_total":0,"scored_pct":0.0,"projects":{"Area32":90,"WPNA":20,"TCB South St":30,"SSW":1}},{"month":"2025-06","core_cleans":731,"proj_cleans":185,"total_cleans":916,"revenue":48496.25,"cogs":23800.0,"gross_margin":24696.25,"gm_pct":50.9,"bags_total":220.8,"scored_pct":27.2,"projects":{"Area32":106,"WPNA":25,"TCB South St":53,"SSW":1}},{"month":"2025-07","core_cleans":793,"proj_cleans":760,"total_cleans":1553,"revenue":81632.5,"cogs":40325.0,"gross_margin":41307.5,"gm_pct":50.6,"bags_total":1684.0,"scored_pct":99.8,"projects":{"SSW":187,"SSNE":414,"Area32":93,"TCB South St":46,"WPNA":20}},{"month":"2025-08","core_cleans":799,"proj_cleans":1199,"total_cleans":1998,"revenue":104763.75,"cogs":51462.5,"gross_margin":53301.25,"gm_pct":50.9,"bags_total":2753.8,"scored_pct":99.8,"projects":{"SSNE":424,"Area32":66,"SSW":645,"WPNA":20,"TCB South St":44}},{"month":"2025-09","core_cleans":797,"proj_cleans":1482,"total_cleans":2279,"revenue":119320.0,"cogs":58450.0,"gross_margin":60870.0,"gm_pct":51.0,"bags_total":3124.8,"scored_pct":99.8,"projects":{"SSNE":466,"SSW":863,"Area32":75,"TCB South St":53,"WPNA":25}},{"month":"2025-10","core_cleans":778,"proj_cleans":1639,"total_cleans":2417,"revenue":127772.5,"cogs":61812.5,"gross_margin":65960.0,"gm_pct":51.6,"bags_total":3422.0,"scored_pct":99.8,"projects":{"SSNE":488,"SSW":1040,"Area32":50,"TCB South St":51,"WPNA":10}},{"month":"2025-11","core_cleans":744,"proj_cleans":1522,"total_cleans":2266,"revenue":120020.0,"cogs":57937.5,"gross_margin":62082.5,"gm_pct":51.7,"bags_total":3447.2,"scored_pct":100.0,"projects":{"SSNE":395,"SSW":987,"TCB South St":49,"Area32":68,"WPNA":23}},{"month":"2025-12","core_cleans":839,"proj_cleans":1664,"total_cleans":2503,"revenue":132745.0,"cogs":64337.5,"gross_margin":68407.5,"gm_pct":51.5,"bags_total":3410.2,"scored_pct":99.9,"projects":{"SSNE":485,"Area32":72,"SSW":1039,"WPNA":20,"TCB South St":48}},{"month":"2026-01","core_cleans":799,"proj_cleans":1628,"total_cleans":2427,"revenue":128901.25,"cogs":62175.0,"gross_margin":66726.25,"gm_pct":51.8,"bags_total":2827.8,"scored_pct":100.0,"projects":{"TCB South St":44,"SSNE":454,"SSW":1032,"Area32":78,"WPNA":20}},{"month":"2026-02","core_cleans":745,"proj_cleans":1460,"total_cleans":2205,"revenue":116138.75,"cogs":56255.0,"gross_margin":59883.75,"gm_pct":51.6,"bags_total":2294.5,"scored_pct":100.0,"projects":{"SSW":960,"WPNA":16,"TCB South St":44,"Area32":67,"SSNE":373}},{"month":"2026-03","core_cleans":920,"proj_cleans":1585,"total_cleans":2505,"revenue":131163.75,"cogs":63875.0,"gross_margin":67288.75,"gm_pct":51.3,"bags_total":2954.2,"scored_pct":99.9,"projects":{"SSW":1065,"SSNE":397,"Area32":70,"TCB South St":48,"WPNA":5}},{"month":"2026-04","core_cleans":909,"proj_cleans":845,"total_cleans":1754,"revenue":92507.5,"cogs":45420.0,"gross_margin":47087.5,"gm_pct":50.9,"bags_total":2048.2,"scored_pct":99.4,"projects":{"SSNE":400,"Area32":78,"SSW":311,"TCB South St":51,"WPNA":5}},{"month":"2026-05","core_cleans":873,"proj_cleans":393,"total_cleans":1266,"revenue":67111.25,"cogs":33320.0,"gross_margin":33791.25,"gm_pct":50.4,"bags_total":1476.5,"scored_pct":99.5,"projects":{"SSNE":276,"Area32":68,"TCB South St":44,"WPNA":5}},{"month":"2026-06","core_cleans":835,"proj_cleans":413,"total_cleans":1248,"revenue":65995.0,"cogs":32775.0,"gross_margin":33220.0,"gm_pct":50.3,"bags_total":1477.0,"scored_pct":99.8,"projects":{"SSNE":280,"Area32":81,"WPNA":4,"TCB South St":48}},{"month":"2026-07","core_cleans":639,"proj_cleans":307,"total_cleans":946,"revenue":49791.25,"cogs":24790.0,"gross_margin":25001.25,"gm_pct":50.2,"bags_total":1110.0,"scored_pct":99.8,"projects":{"WPNA":3,"SSNE":197,"Area32":70,"TCB South St":37}}]};

const fmt = (n) => n.toLocaleString("en-US");
const fmtK = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : fmt(Math.round(n));
const fmtDollar = (n) => `$${fmtK(n)}`;
const fmtMonth = (m) => {
  const [y, mo] = m.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[parseInt(mo)-1]} '${y.slice(2)}`;
};

const BLUE = "#2563eb";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const PURPLE = "#7c3aed";
const GRAY = "#6b7280";

function MetricCard({ label, value, sub, color = BLUE }) {
  return (
    <div style={{
      background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 8,
      padding: "12px 16px", textAlign: "center", flex: 1, minWidth: 140
    }}>
      <div style={{ fontSize: 11, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, marginTop: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "white", border: "1px solid #e5e7eb", borderRadius: 6,
      padding: "8px 12px", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 1 }}>
          {p.name}: {typeof p.value === "number" && p.name.includes("$")
            ? `$${p.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
            : typeof p.value === "number" ? p.value.toLocaleString("en-US", { maximumFractionDigits: 0 }) : p.value}
        </div>
      ))}
    </div>
  );
}

export default function CleaningDashboard() {
  const [view, setView] = useState("all");

  const months = RAW_DATA.months;
  const currentMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];

  const totals = useMemo(() => ({
    cleans: months.reduce((s, m) => s + m.total_cleans, 0),
    revenue: months.reduce((s, m) => s + m.revenue, 0),
    cogs: months.reduce((s, m) => s + m.cogs, 0),
    bags: months.reduce((s, m) => s + m.bags_total, 0),
  }), [months]);

  const chartData = useMemo(() => {
    let data = months.map(m => ({
      name: fmtMonth(m.month),
      month: m.month,
      core: m.core_cleans,
      project: m.proj_cleans,
      total: m.total_cleans,
      revenue: Math.round(m.revenue),
      cogs: Math.round(m.cogs),
      margin: Math.round(m.gross_margin),
      bags: Math.round(m.bags_total),
      gm_pct: m.gm_pct,
    }));
    if (view === "12mo") data = data.slice(-12);
    if (view === "24mo") data = data.slice(-24);
    return data;
  }, [months, view]);

  const bagsData = useMemo(() => {
    return chartData.filter(d => d.bags > 0);
  }, [chartData]);

  const handleExport = () => {
    const headers = ["Month","Core Cleans","Project Cleans","Total Cleans","Revenue","COGS","Gross Margin","GM%","Bags (est)"];
    const rows = months.map(m => [
      m.month, m.core_cleans, m.proj_cleans, m.total_cleans,
      m.revenue.toFixed(2), m.cogs.toFixed(2), m.gross_margin.toFixed(2),
      m.gm_pct.toFixed(1), m.bags_total.toFixed(0)
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cleaning_operations_${RAW_DATA.generated}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const sectionStyle = { marginBottom: 20 };
  const chartBoxStyle = {
    background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 8,
    padding: "16px 16px 8px"
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", maxWidth: 820, margin: "0 auto", padding: "12px 16px", color: "#1f2937" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>Cleaning Operations</h1>
        <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>
          Data from {fmtMonth(months[0].month)} to {fmtMonth(currentMonth.month)} · {fmt(RAW_DATA.total_records)} cleaning records · Generated {RAW_DATA.generated}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <MetricCard label="Total Cleans" value={fmt(totals.cleans)} sub="all time" />
        <MetricCard label="Total Revenue" value={`$${(totals.revenue/1e6).toFixed(1)}M`} sub="all time" />
        <MetricCard label="Bags Diverted" value={`${fmtK(totals.bags)}`} sub="est. since Jun '25" color={AMBER} />
        <MetricCard label="Gross Margin" value={`$${(totals.revenue - totals.cogs > 0 ? ((totals.revenue - totals.cogs)/1e6).toFixed(1) : 0)}M`} sub={`~${((1 - totals.cogs/totals.revenue)*100).toFixed(0)}% avg`} color={TEAL} />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {["all","24mo","12mo"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer",
            border: view === v ? `1px solid ${BLUE}` : "1px solid #d1d5db",
            background: view === v ? BLUE : "white",
            color: view === v ? "white" : GRAY,
          }}>
            {v === "all" ? "All Time" : v === "24mo" ? "24 Months" : "12 Months"}
          </button>
        ))}
      </div>

      <div style={{ ...sectionStyle, ...chartBoxStyle }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Cleans per Month</div>
        <div style={{ fontSize: 11, color: GRAY, marginBottom: 10 }}>Stacked: Core + Project/Grant · Revenue line on right axis</div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: GRAY }} interval={view === "all" ? 5 : view === "24mo" ? 2 : 0} angle={-45} textAnchor="end" height={40} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: GRAY }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: GRAY }} tickFormatter={v => `$${fmtK(v)}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="core" stackId="a" fill={BLUE} name="Core Cleans" radius={[0,0,0,0]} />
            <Bar yAxisId="left" dataKey="project" stackId="a" fill={TEAL} name="Project/Grant Cleans" radius={[2,2,0,0]} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={AMBER} strokeWidth={2} dot={false} name="Revenue ($)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {bagsData.length > 0 && (
        <div style={{ ...sectionStyle, ...chartBoxStyle }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Bags of Trash Diverted</div>
          <div style={{ fontSize: 11, color: GRAY, marginBottom: 10 }}>Estimated from Trash + Debris scores · Scoring began Jun 2025</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={bagsData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: GRAY }} />
              <YAxis tick={{ fontSize: 10, fill: GRAY }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="bags" fill="#fbbf24" fillOpacity={0.2} stroke={AMBER} strokeWidth={2} name="Bags Diverted" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ ...sectionStyle, ...chartBoxStyle }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Revenue and Gross Margin</div>
        <div style={{ fontSize: 11, color: GRAY, marginBottom: 10 }}>Revenue ($50 × multiplier per clean) · COGS ($25 × multiplier) · ~50% GM</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: GRAY }} interval={view === "all" ? 5 : view === "24mo" ? 2 : 0} angle={-45} textAnchor="end" height={40} />
            <YAxis tick={{ fontSize: 10, fill: GRAY }} tickFormatter={v => `$${fmtK(v)}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" fill={BLUE} fillOpacity={0.1} stroke={BLUE} strokeWidth={2} name="Revenue ($)" />
            <Area type="monotone" dataKey="margin" fill={TEAL} fillOpacity={0.15} stroke={TEAL} strokeWidth={2} name="Gross Margin ($)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...sectionStyle, ...chartBoxStyle }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Monthly Summary</div>
            <div style={{ fontSize: 11, color: GRAY }}>{months.length} months · {fmtMonth(months[0].month)} → {fmtMonth(currentMonth.month)}</div>
          </div>
          <button onClick={handleExport} style={{
            background: BLUE, color: "white", border: "none", borderRadius: 5,
            padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer"
          }}>
            Export CSV
          </button>
        </div>
        <div style={{ overflowX: "auto", fontSize: 11 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #d1d5db" }}>
                {["Month","Core","Proj","Total","Revenue","COGS","Margin","GM%","Bags"].map(h => (
                  <th key={h} style={{ padding: "6px 6px", textAlign: h === "Month" ? "left" : "right", fontWeight: 600, fontSize: 10, color: GRAY }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...months].reverse().map((m, i) => (
                <tr key={m.month} style={{ borderBottom: "1px solid #f0f0f0", background: i === 0 ? "#eff6ff" : "transparent" }}>
                  <td style={{ padding: "5px 6px", fontWeight: i === 0 ? 600 : 400 }}>{fmtMonth(m.month)}</td>
                  <td style={{ textAlign: "right", padding: "5px 6px" }}>{fmt(m.core_cleans)}</td>
                  <td style={{ textAlign: "right", padding: "5px 6px", color: m.proj_cleans > 0 ? TEAL : "#d1d5db" }}>{fmt(m.proj_cleans)}</td>
                  <td style={{ textAlign: "right", padding: "5px 6px", fontWeight: 600 }}>{fmt(m.total_cleans)}</td>
                  <td style={{ textAlign: "right", padding: "5px 6px" }}>${fmt(Math.round(m.revenue))}</td>
                  <td style={{ textAlign: "right", padding: "5px 6px" }}>${fmt(Math.round(m.cogs))}</td>
                  <td style={{ textAlign: "right", padding: "5px 6px" }}>${fmt(Math.round(m.gross_margin))}</td>
                  <td style={{ textAlign: "right", padding: "5px 6px" }}>{m.gm_pct.toFixed(1)}%</td>
                  <td style={{ textAlign: "right", padding: "5px 6px", color: m.bags_total > 0 ? AMBER : "#d1d5db" }}>
                    {m.bags_total > 0 ? fmt(Math.round(m.bags_total)) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", marginTop: 8, paddingBottom: 12 }}>
        Revenue = $50 × block multiplier per cleaning · COGS = $25 × multiplier (cleaner payout) · Bags: Rare=0.25, Light=0.5, Med=0.75, Heavy=1.25, Severe=2.0 (Trash + Debris) · Bag estimates begin Jun 2025 when scoring started
      </div>
    </div>
  );
}
