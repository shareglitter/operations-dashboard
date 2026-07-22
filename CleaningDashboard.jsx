import { useState, useMemo } from "react";
import { BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

const DATA = [{"month":"2021-09","core_cleans":34,"project_cleans":0,"grant_cleans":0,"total_cleans":34,"revenue":1700,"cogs":850,"gross_margin":850,"gm_pct":50.0,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2021-10","core_cleans":107,"project_cleans":0,"grant_cleans":0,"total_cleans":107,"revenue":5275.0,"cogs":2675,"gross_margin":2600.0,"gm_pct":49.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2021-11","core_cleans":94,"project_cleans":0,"grant_cleans":0,"total_cleans":94,"revenue":4640.0,"cogs":2350,"gross_margin":2290.0,"gm_pct":49.4,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2021-12","core_cleans":110,"project_cleans":0,"grant_cleans":0,"total_cleans":110,"revenue":5425.0,"cogs":2750,"gross_margin":2675.0,"gm_pct":49.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-01","core_cleans":114,"project_cleans":0,"grant_cleans":0,"total_cleans":114,"revenue":5590.0,"cogs":2850,"gross_margin":2740.0,"gm_pct":49.0,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-02","core_cleans":106,"project_cleans":0,"grant_cleans":0,"total_cleans":106,"revenue":5302.5,"cogs":2700,"gross_margin":2602.5,"gm_pct":49.1,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-03","core_cleans":162,"project_cleans":0,"grant_cleans":0,"total_cleans":162,"revenue":8237.5,"cogs":4175.0,"gross_margin":4062.5,"gm_pct":49.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-04","core_cleans":153,"project_cleans":0,"grant_cleans":0,"total_cleans":153,"revenue":7815.0,"cogs":3962.5,"gross_margin":3852.5,"gm_pct":49.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-05","core_cleans":220,"project_cleans":0,"grant_cleans":0,"total_cleans":220,"revenue":12317.5,"cogs":5675.0,"gross_margin":6642.5,"gm_pct":53.9,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-06","core_cleans":292,"project_cleans":0,"grant_cleans":0,"total_cleans":292,"revenue":15737.5,"cogs":7525.0,"gross_margin":8212.5,"gm_pct":52.2,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-07","core_cleans":264,"project_cleans":0,"grant_cleans":0,"total_cleans":264,"revenue":13927.5,"cogs":6775.0,"gross_margin":7152.5,"gm_pct":51.4,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-08","core_cleans":336,"project_cleans":0,"grant_cleans":0,"total_cleans":336,"revenue":18000.0,"cogs":8600.0,"gross_margin":9400.0,"gm_pct":52.2,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-09","core_cleans":305,"project_cleans":0,"grant_cleans":0,"total_cleans":305,"revenue":16262.5,"cogs":7825.0,"gross_margin":8437.5,"gm_pct":51.9,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-10","core_cleans":434,"project_cleans":0,"grant_cleans":0,"total_cleans":434,"revenue":22777.5,"cogs":11025.0,"gross_margin":11752.5,"gm_pct":51.6,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-11","core_cleans":298,"project_cleans":0,"grant_cleans":0,"total_cleans":298,"revenue":15730.0,"cogs":7637.5,"gross_margin":8092.5,"gm_pct":51.4,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2022-12","core_cleans":328,"project_cleans":0,"grant_cleans":0,"total_cleans":328,"revenue":17600.0,"cogs":8512.5,"gross_margin":9087.5,"gm_pct":51.6,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-01","core_cleans":356,"project_cleans":0,"grant_cleans":0,"total_cleans":356,"revenue":19177.5,"cogs":9200.0,"gross_margin":9977.5,"gm_pct":52.0,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-02","core_cleans":359,"project_cleans":0,"grant_cleans":0,"total_cleans":359,"revenue":19165.0,"cogs":9287.5,"gross_margin":9877.5,"gm_pct":51.5,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-03","core_cleans":468,"project_cleans":0,"grant_cleans":0,"total_cleans":468,"revenue":24733.75,"cogs":12125.0,"gross_margin":12608.75,"gm_pct":51.0,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-04","core_cleans":431,"project_cleans":8,"grant_cleans":0,"total_cleans":439,"revenue":23186.25,"cogs":11325.0,"gross_margin":11861.25,"gm_pct":51.2,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-05","core_cleans":512,"project_cleans":37,"grant_cleans":0,"total_cleans":549,"revenue":28907.5,"cogs":14175.0,"gross_margin":14732.5,"gm_pct":51.0,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-06","core_cleans":531,"project_cleans":35,"grant_cleans":6,"total_cleans":572,"revenue":30288.75,"cogs":14737.5,"gross_margin":15551.25,"gm_pct":51.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-07","core_cleans":502,"project_cleans":41,"grant_cleans":9,"total_cleans":552,"revenue":29107.5,"cogs":14175.0,"gross_margin":14932.5,"gm_pct":51.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-08","core_cleans":562,"project_cleans":51,"grant_cleans":9,"total_cleans":622,"revenue":32838.75,"cogs":16087.5,"gross_margin":16751.25,"gm_pct":51.0,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-09","core_cleans":542,"project_cleans":44,"grant_cleans":8,"total_cleans":594,"revenue":31692.5,"cogs":15375.0,"gross_margin":16317.5,"gm_pct":51.5,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-10","core_cleans":527,"project_cleans":52,"grant_cleans":7,"total_cleans":586,"revenue":31370.0,"cogs":15250.0,"gross_margin":16120.0,"gm_pct":51.4,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-11","core_cleans":549,"project_cleans":47,"grant_cleans":4,"total_cleans":600,"revenue":31913.75,"cogs":15587.5,"gross_margin":16326.25,"gm_pct":51.2,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2023-12","core_cleans":547,"project_cleans":44,"grant_cleans":13,"total_cleans":604,"revenue":32192.5,"cogs":15625.0,"gross_margin":16567.5,"gm_pct":51.5,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-01","core_cleans":571,"project_cleans":58,"grant_cleans":9,"total_cleans":638,"revenue":33932.5,"cogs":16537.5,"gross_margin":17395.0,"gm_pct":51.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-02","core_cleans":572,"project_cleans":96,"grant_cleans":0,"total_cleans":668,"revenue":35195.0,"cogs":17250.0,"gross_margin":17945.0,"gm_pct":51.0,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-03","core_cleans":593,"project_cleans":92,"grant_cleans":0,"total_cleans":685,"revenue":36188.75,"cogs":17662.5,"gross_margin":18526.25,"gm_pct":51.2,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-04","core_cleans":610,"project_cleans":101,"grant_cleans":0,"total_cleans":711,"revenue":37282.5,"cogs":18300.0,"gross_margin":18982.5,"gm_pct":50.9,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-05","core_cleans":594,"project_cleans":105,"grant_cleans":0,"total_cleans":699,"revenue":36682.5,"cogs":18000.0,"gross_margin":18682.5,"gm_pct":50.9,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-06","core_cleans":549,"project_cleans":92,"grant_cleans":0,"total_cleans":641,"revenue":33998.75,"cogs":16550.0,"gross_margin":17448.75,"gm_pct":51.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-07","core_cleans":711,"project_cleans":118,"grant_cleans":0,"total_cleans":829,"revenue":43270.0,"cogs":21312.5,"gross_margin":21957.5,"gm_pct":50.7,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-08","core_cleans":741,"project_cleans":123,"grant_cleans":0,"total_cleans":864,"revenue":45276.25,"cogs":22225.0,"gross_margin":23051.25,"gm_pct":50.9,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-09","core_cleans":697,"project_cleans":111,"grant_cleans":0,"total_cleans":808,"revenue":41882.5,"cogs":20812.5,"gross_margin":21070.0,"gm_pct":50.3,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-10","core_cleans":743,"project_cleans":111,"grant_cleans":0,"total_cleans":854,"revenue":43970.0,"cogs":21937.5,"gross_margin":22032.5,"gm_pct":50.1,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-11","core_cleans":724,"project_cleans":106,"grant_cleans":0,"total_cleans":830,"revenue":43457.5,"cogs":21487.5,"gross_margin":21970.0,"gm_pct":50.6,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2024-12","core_cleans":799,"project_cleans":120,"grant_cleans":0,"total_cleans":919,"revenue":48198.75,"cogs":23812.5,"gross_margin":24386.25,"gm_pct":50.6,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2025-01","core_cleans":821,"project_cleans":121,"grant_cleans":0,"total_cleans":942,"revenue":49370.0,"cogs":24375.0,"gross_margin":24995.0,"gm_pct":50.6,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2025-02","core_cleans":727,"project_cleans":100,"grant_cleans":0,"total_cleans":827,"revenue":43495.0,"cogs":21437.5,"gross_margin":22057.5,"gm_pct":50.7,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2025-03","core_cleans":744,"project_cleans":124,"grant_cleans":0,"total_cleans":868,"revenue":46013.75,"cogs":22650.0,"gross_margin":23363.75,"gm_pct":50.8,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2025-04","core_cleans":729,"project_cleans":127,"grant_cleans":1,"total_cleans":857,"revenue":45370.0,"cogs":22350.0,"gross_margin":23020.0,"gm_pct":50.7,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2025-05","core_cleans":737,"project_cleans":140,"grant_cleans":1,"total_cleans":878,"revenue":46507.5,"cogs":22887.5,"gross_margin":23620.0,"gm_pct":50.8,"bags":0,"scored_cleans":0,"score_pct":0.0},{"month":"2025-06","core_cleans":731,"project_cleans":184,"grant_cleans":1,"total_cleans":916,"revenue":48496.25,"cogs":23800.0,"gross_margin":24696.25,"gm_pct":50.9,"bags":220.75,"scored_cleans":249,"score_pct":27.2},{"month":"2025-07","core_cleans":793,"project_cleans":159,"grant_cleans":601,"total_cleans":1553,"revenue":81632.5,"cogs":40325.0,"gross_margin":41307.5,"gm_pct":50.6,"bags":1684.0,"scored_cleans":1550,"score_pct":99.8},{"month":"2025-08","core_cleans":799,"project_cleans":130,"grant_cleans":1069,"total_cleans":1998,"revenue":104763.75,"cogs":51462.5,"gross_margin":53301.25,"gm_pct":50.9,"bags":2753.75,"scored_cleans":1994,"score_pct":99.8},{"month":"2025-09","core_cleans":797,"project_cleans":153,"grant_cleans":1329,"total_cleans":2279,"revenue":119320.0,"cogs":58450.0,"gross_margin":60870.0,"gm_pct":51.0,"bags":3124.75,"scored_cleans":2275,"score_pct":99.8},{"month":"2025-10","core_cleans":778,"project_cleans":111,"grant_cleans":1528,"total_cleans":2417,"revenue":127772.5,"cogs":61812.5,"gross_margin":65960.0,"gm_pct":51.6,"bags":3422.0,"scored_cleans":2411,"score_pct":99.8},{"month":"2025-11","core_cleans":744,"project_cleans":140,"grant_cleans":1382,"total_cleans":2266,"revenue":120020.0,"cogs":57937.5,"gross_margin":62082.5,"gm_pct":51.7,"bags":3447.25,"scored_cleans":2266,"score_pct":100.0},{"month":"2025-12","core_cleans":839,"project_cleans":140,"grant_cleans":1524,"total_cleans":2503,"revenue":132745.0,"cogs":64337.5,"gross_margin":68407.5,"gm_pct":51.5,"bags":3410.25,"scored_cleans":2501,"score_pct":99.9},{"month":"2026-01","core_cleans":799,"project_cleans":142,"grant_cleans":1486,"total_cleans":2427,"revenue":128901.25,"cogs":62175.0,"gross_margin":66726.25,"gm_pct":51.8,"bags":2827.75,"scored_cleans":2426,"score_pct":100.0},{"month":"2026-02","core_cleans":745,"project_cleans":127,"grant_cleans":1333,"total_cleans":2205,"revenue":116138.75,"cogs":56255.0,"gross_margin":59883.75,"gm_pct":51.6,"bags":2294.5,"scored_cleans":2205,"score_pct":100.0},{"month":"2026-03","core_cleans":920,"project_cleans":123,"grant_cleans":1462,"total_cleans":2505,"revenue":131163.75,"cogs":63875.0,"gross_margin":67288.75,"gm_pct":51.3,"bags":2954.25,"scored_cleans":2502,"score_pct":99.9},{"month":"2026-04","core_cleans":909,"project_cleans":134,"grant_cleans":711,"total_cleans":1754,"revenue":92507.5,"cogs":45420.0,"gross_margin":47087.5,"gm_pct":50.9,"bags":2048.25,"scored_cleans":1743,"score_pct":99.4},{"month":"2026-05","core_cleans":873,"project_cleans":117,"grant_cleans":276,"total_cleans":1266,"revenue":67111.25,"cogs":33320.0,"gross_margin":33791.25,"gm_pct":50.4,"bags":1476.5,"scored_cleans":1260,"score_pct":99.5},{"month":"2026-06","core_cleans":835,"project_cleans":133,"grant_cleans":280,"total_cleans":1248,"revenue":65995.0,"cogs":32775.0,"gross_margin":33220.0,"gm_pct":50.3,"bags":1477.0,"scored_cleans":1245,"score_pct":99.8},{"month":"2026-07","core_cleans":639,"project_cleans":110,"grant_cleans":197,"total_cleans":946,"revenue":49791.25,"cogs":24790.0,"gross_margin":25001.25,"gm_pct":50.2,"bags":1110.0,"scored_cleans":944,"score_pct":99.8}];

const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n.toFixed(0);
const fmtD = (n) => `$${n >= 1000 ? `${(n/1000).toFixed(1)}K` : n.toFixed(0)}`;
const fmtFull = (n) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const shortMonth = (m) => {
  const [y, mo] = m.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(mo)-1]} '${y.slice(2)}`;
};

const COLORS = { core: "#2563eb", project: "#8b5cf6", grant: "#14b8a6", revenue: "#f97316", bags: "#eab308", margin: "#10b981" };

function Stat({ label, value, sub, color = "#2563eb" }) {
  return (
    <div style={{ flex: 1, minWidth: 140, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, marginTop: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{shortMonth(label)}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: "#64748b" }}>{p.name}:</span>
          <span style={{ fontWeight: 500 }}>{typeof p.value === "number" && p.dataKey?.includes("revenue") ? fmtFull(p.value) : p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [view, setView] = useState("charts");
  const lastComplete = DATA[DATA.length - 2];
  const current = DATA[DATA.length - 1];

  const totals = useMemo(() => ({
    cleans: DATA.reduce((s, d) => s + d.total_cleans, 0),
    revenue: DATA.reduce((s, d) => s + d.revenue, 0),
    cogs: DATA.reduce((s, d) => s + d.cogs, 0),
    bags: DATA.reduce((s, d) => s + d.bags, 0),
    core: DATA.reduce((s, d) => s + d.core_cleans, 0),
    project: DATA.reduce((s, d) => s + d.project_cleans, 0),
    grant: DATA.reduce((s, d) => s + d.grant_cleans, 0),
  }), []);

  const chartData = useMemo(() => DATA.map(d => ({
    ...d,
    label: shortMonth(d.month),
    revenueK: d.revenue / 1000,
  })), []);

  const bagsData = useMemo(() => DATA.filter(d => d.bags > 0), []);

  const exportCSV = () => {
    const headers = ["Month","Core","Project","Grant","Total","Revenue","COGS","Margin","GM%","Bags"];
    const rows = DATA.map(d => [d.month, d.core_cleans, d.project_cleans, d.grant_cleans, d.total_cleans, d.revenue.toFixed(0), d.cogs.toFixed(0), d.gross_margin.toFixed(0), d.gm_pct + "%", d.bags.toFixed(1)]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cleaning_monthly_summary.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const xTickFormatter = (val, idx) => {
    if (chartData.length <= 24) return shortMonth(val);
    const d = DATA[idx];
    if (!d) return "";
    const mo = parseInt(d.month.split("-")[1]);
    if (mo === 1 || mo === 7) return shortMonth(val);
    return "";
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "16px 12px", color: "#1e293b" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>Cleaning Operations Dashboard</h1>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>
          {DATA[0].month} → {current.month} · {totals.cleans.toLocaleString()} cleanings from Airtable · Last month shown ({shortMonth(current.month)}) is partial
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <Stat label="Total Cleans" value={totals.cleans.toLocaleString()} sub="all time" />
        <Stat label="Bags Diverted" value={fmt(totals.bags)} sub="scored from Jun '25" color="#eab308" />
        <Stat label="Last Full Month" value={lastComplete.total_cleans.toLocaleString()} sub={shortMonth(lastComplete.month)} />
        <Stat label="Total Revenue" value={fmtD(totals.revenue)} sub={`~${totals.gm_pct || "51"}% GM`} color="#10b981" />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["charts", "table"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "6px 16px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, fontWeight: 500, cursor: "pointer",
            background: view === v ? "#1e293b" : "white", color: view === v ? "white" : "#64748b",
          }}>
            {v === "charts" ? "Charts" : "Data Table"}
          </button>
        ))}
        <button onClick={exportCSV} style={{
          marginLeft: "auto", padding: "6px 14px", borderRadius: 6, border: "1px solid #2563eb", background: "#2563eb", color: "white", fontSize: 12, fontWeight: 500, cursor: "pointer"
        }}>
          Export CSV
        </button>
      </div>

      {view === "charts" ? (
        <>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 8px 8px", marginBottom: 16 }}>
            <div style={{ padding: "0 12px", marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Cleans per Month</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Stacked by Core / Project / Grant — Revenue line on right axis</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94a3b8" }} tickFormatter={xTickFormatter} interval={0} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#f97316" }} tickFormatter={v => `$${v}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="core_cleans" stackId="cleans" fill={COLORS.core} name="Core" radius={[0,0,0,0]} />
                <Bar yAxisId="left" dataKey="project_cleans" stackId="cleans" fill={COLORS.project} name="Project" />
                <Bar yAxisId="left" dataKey="grant_cleans" stackId="cleans" fill={COLORS.grant} name="Grant" radius={[2,2,0,0]} />
                <Line yAxisId="right" dataKey="revenueK" stroke={COLORS.revenue} strokeWidth={2} dot={false} name="Revenue ($K)" />
              </ComposedChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 14, padding: "6px 12px 0", fontSize: 11 }}>
              {[["Core", COLORS.core], ["Project", COLORS.project], ["Grant", COLORS.grant]].map(([n, c]) => (
                <span key={n} style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b" }}>
                  <span style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />{n}
                </span>
              ))}
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b" }}>
                <span style={{ width: 14, height: 2, background: COLORS.revenue, borderRadius: 1 }} />Revenue
              </span>
            </div>
          </div>

          {bagsData.length > 0 && (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 8px 8px", marginBottom: 16 }}>
              <div style={{ padding: "0 12px", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Bags of Trash Diverted per Month</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Estimated from Trash + Debris scores (Rare=0.25, Light=0.5, Med=0.75, Heavy=1.25, Severe=2)</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={bagsData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => shortMonth(v)} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={v => fmt(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="bags" stroke={COLORS.bags} fill={COLORS.bags} fillOpacity={0.2} name="Bags" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 10, color: "#94a3b8", padding: "4px 12px 0", fontStyle: "italic" }}>
                Scoring began Jun '25. Earlier months have no bag data. Totals are estimates and may undercount.
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 8px 8px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, padding: "0 12px" }}>Revenue and Gross Margin</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#94a3b8" }} tickFormatter={xTickFormatter} interval={0} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickFormatter={v => `$${v/1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke={COLORS.revenue} fill={COLORS.revenue} fillOpacity={0.1} name="Revenue" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="gross_margin" stroke={COLORS.margin} fill={COLORS.margin} fillOpacity={0.15} name="Gross Margin" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: 300, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 8px 8px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, padding: "0 12px" }}>Core Cleans (ex-Grant/Project)</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#94a3b8" }} tickFormatter={xTickFormatter} interval={0} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="core_cleans" fill={COLORS.core} name="Core Cleans" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "auto" }}>
          <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                {["Month","Core","Proj","Grant","Total","Revenue","COGS","Margin","GM%","Bags"].map(h => (
                  <th key={h} style={{ padding: "8px 6px", textAlign: h === "Month" ? "left" : "right", fontWeight: 600, fontSize: 10, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...DATA].reverse().map((d, i) => (
                <tr key={d.month} style={{ borderBottom: "1px solid #f1f5f9", background: i === 0 ? "#fffbeb" : "transparent" }}>
                  <td style={{ padding: "6px", fontWeight: 500 }}>{shortMonth(d.month)}{i === 0 ? " *" : ""}</td>
                  <td style={{ padding: "6px", textAlign: "right" }}>{d.core_cleans.toLocaleString()}</td>
                  <td style={{ padding: "6px", textAlign: "right" }}>{d.project_cleans.toLocaleString()}</td>
                  <td style={{ padding: "6px", textAlign: "right" }}>{d.grant_cleans.toLocaleString()}</td>
                  <td style={{ padding: "6px", textAlign: "right", fontWeight: 600 }}>{d.total_cleans.toLocaleString()}</td>
                  <td style={{ padding: "6px", textAlign: "right" }}>{fmtFull(d.revenue)}</td>
                  <td style={{ padding: "6px", textAlign: "right" }}>{fmtFull(d.cogs)}</td>
                  <td style={{ padding: "6px", textAlign: "right", color: "#10b981" }}>{fmtFull(d.gross_margin)}</td>
                  <td style={{ padding: "6px", textAlign: "right" }}>{d.gm_pct}%</td>
                  <td style={{ padding: "6px", textAlign: "right", color: d.bags > 0 ? "#eab308" : "#cbd5e1" }}>{d.bags > 0 ? d.bags.toFixed(0) : "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#e2e8f0", fontWeight: 600 }}>
                <td style={{ padding: "8px 6px" }}>TOTAL</td>
                <td style={{ padding: "8px 6px", textAlign: "right" }}>{totals.core.toLocaleString()}</td>
                <td style={{ padding: "8px 6px", textAlign: "right" }}>{totals.project.toLocaleString()}</td>
                <td style={{ padding: "8px 6px", textAlign: "right" }}>{totals.grant.toLocaleString()}</td>
                <td style={{ padding: "8px 6px", textAlign: "right" }}>{totals.cleans.toLocaleString()}</td>
                <td style={{ padding: "8px 6px", textAlign: "right" }}>{fmtFull(totals.revenue)}</td>
                <td style={{ padding: "8px 6px", textAlign: "right" }}>{fmtFull(totals.cogs)}</td>
                <td style={{ padding: "8px 6px", textAlign: "right", color: "#10b981" }}>{fmtFull(totals.revenue - totals.cogs)}</td>
                <td style={{ padding: "8px 6px", textAlign: "right" }}>{((totals.revenue - totals.cogs) / totals.revenue * 100).toFixed(1)}%</td>
                <td style={{ padding: "8px 6px", textAlign: "right", color: "#eab308" }}>{totals.bags.toFixed(0)}</td>
              </tr>
            </tfoot>
          </table>
          <div style={{ fontSize: 10, color: "#94a3b8", padding: "8px 12px", fontStyle: "italic" }}>
            * Current month is partial. Revenue = $50 x block multiplier per cleaning. COGS = cleaner payout. Bags estimated from Trash+Debris scores (scoring began Jun '25).
          </div>
        </div>
      )}

      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 16, lineHeight: 1.6 }}>
        <strong>Data snapshot:</strong> Pulled {new Date().toLocaleDateString()} from Airtable Cleaning Log ({totals.cleans.toLocaleString()} records).
        Revenue = $50 x multiplier per cleaning. Multipliers range 0.5–4x across blocks.
        Bags = Trash score + Debris score per cleaning (Rare=0.25, Light=0.5, Medium=0.75, Heavy=1.25, Severe=2.0). Scoring began Jun 2025.
        Core = no project tag. Project = non-grant project (TCB, etc). Grant = SSNE or SSW.
      </div>
    </div>
  );
}
