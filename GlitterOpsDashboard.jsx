import { useState, useMemo } from "react";
import { BarChart, Bar, AreaChart, Area, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CLEANS = [{"month":"2021-09","core_cleans":34,"project_cleans":0,"grant_cleans":0,"total_cleans":34,"revenue":1700,"cogs":850,"gross_margin":850,"gm_pct":50.0,"bags":0},{"month":"2021-10","core_cleans":107,"project_cleans":0,"grant_cleans":0,"total_cleans":107,"revenue":5275,"cogs":2675,"gross_margin":2600,"gm_pct":49.3,"bags":0},{"month":"2021-11","core_cleans":94,"project_cleans":0,"grant_cleans":0,"total_cleans":94,"revenue":4640,"cogs":2350,"gross_margin":2290,"gm_pct":49.4,"bags":0},{"month":"2021-12","core_cleans":110,"project_cleans":0,"grant_cleans":0,"total_cleans":110,"revenue":5425,"cogs":2750,"gross_margin":2675,"gm_pct":49.3,"bags":0},{"month":"2022-01","core_cleans":114,"project_cleans":0,"grant_cleans":0,"total_cleans":114,"revenue":5590,"cogs":2850,"gross_margin":2740,"gm_pct":49.0,"bags":0},{"month":"2022-02","core_cleans":106,"project_cleans":0,"grant_cleans":0,"total_cleans":106,"revenue":5303,"cogs":2700,"gross_margin":2603,"gm_pct":49.1,"bags":0},{"month":"2022-03","core_cleans":162,"project_cleans":0,"grant_cleans":0,"total_cleans":162,"revenue":8238,"cogs":4175,"gross_margin":4063,"gm_pct":49.3,"bags":0},{"month":"2022-04","core_cleans":153,"project_cleans":0,"grant_cleans":0,"total_cleans":153,"revenue":7815,"cogs":3963,"gross_margin":3853,"gm_pct":49.3,"bags":0},{"month":"2022-05","core_cleans":220,"project_cleans":0,"grant_cleans":0,"total_cleans":220,"revenue":12318,"cogs":5675,"gross_margin":6643,"gm_pct":53.9,"bags":0},{"month":"2022-06","core_cleans":292,"project_cleans":0,"grant_cleans":0,"total_cleans":292,"revenue":15738,"cogs":7525,"gross_margin":8213,"gm_pct":52.2,"bags":0},{"month":"2022-07","core_cleans":264,"project_cleans":0,"grant_cleans":0,"total_cleans":264,"revenue":13928,"cogs":6775,"gross_margin":7153,"gm_pct":51.4,"bags":0},{"month":"2022-08","core_cleans":336,"project_cleans":0,"grant_cleans":0,"total_cleans":336,"revenue":18000,"cogs":8600,"gross_margin":9400,"gm_pct":52.2,"bags":0},{"month":"2022-09","core_cleans":305,"project_cleans":0,"grant_cleans":0,"total_cleans":305,"revenue":16263,"cogs":7825,"gross_margin":8438,"gm_pct":51.9,"bags":0},{"month":"2022-10","core_cleans":434,"project_cleans":0,"grant_cleans":0,"total_cleans":434,"revenue":22778,"cogs":11025,"gross_margin":11753,"gm_pct":51.6,"bags":0},{"month":"2022-11","core_cleans":298,"project_cleans":0,"grant_cleans":0,"total_cleans":298,"revenue":15730,"cogs":7638,"gross_margin":8093,"gm_pct":51.4,"bags":0},{"month":"2022-12","core_cleans":328,"project_cleans":0,"grant_cleans":0,"total_cleans":328,"revenue":17600,"cogs":8513,"gross_margin":9088,"gm_pct":51.6,"bags":0},{"month":"2023-01","core_cleans":356,"project_cleans":0,"grant_cleans":0,"total_cleans":356,"revenue":19178,"cogs":9200,"gross_margin":9978,"gm_pct":52.0,"bags":0},{"month":"2023-02","core_cleans":359,"project_cleans":0,"grant_cleans":0,"total_cleans":359,"revenue":19165,"cogs":9288,"gross_margin":9878,"gm_pct":51.5,"bags":0},{"month":"2023-03","core_cleans":468,"project_cleans":0,"grant_cleans":0,"total_cleans":468,"revenue":24734,"cogs":12125,"gross_margin":12609,"gm_pct":51.0,"bags":0},{"month":"2023-04","core_cleans":431,"project_cleans":8,"grant_cleans":0,"total_cleans":439,"revenue":23186,"cogs":11325,"gross_margin":11861,"gm_pct":51.2,"bags":0},{"month":"2023-05","core_cleans":512,"project_cleans":37,"grant_cleans":0,"total_cleans":549,"revenue":28908,"cogs":14175,"gross_margin":14733,"gm_pct":51.0,"bags":0},{"month":"2023-06","core_cleans":531,"project_cleans":35,"grant_cleans":6,"total_cleans":572,"revenue":30289,"cogs":14738,"gross_margin":15551,"gm_pct":51.3,"bags":0},{"month":"2023-07","core_cleans":502,"project_cleans":41,"grant_cleans":9,"total_cleans":552,"revenue":29108,"cogs":14175,"gross_margin":14933,"gm_pct":51.3,"bags":0},{"month":"2023-08","core_cleans":562,"project_cleans":51,"grant_cleans":9,"total_cleans":622,"revenue":32839,"cogs":16088,"gross_margin":16751,"gm_pct":51.0,"bags":0},{"month":"2023-09","core_cleans":542,"project_cleans":44,"grant_cleans":8,"total_cleans":594,"revenue":31693,"cogs":15375,"gross_margin":16318,"gm_pct":51.5,"bags":0},{"month":"2023-10","core_cleans":527,"project_cleans":52,"grant_cleans":7,"total_cleans":586,"revenue":31370,"cogs":15250,"gross_margin":16120,"gm_pct":51.4,"bags":0},{"month":"2023-11","core_cleans":549,"project_cleans":47,"grant_cleans":4,"total_cleans":600,"revenue":31914,"cogs":15588,"gross_margin":16326,"gm_pct":51.2,"bags":0},{"month":"2023-12","core_cleans":547,"project_cleans":44,"grant_cleans":13,"total_cleans":604,"revenue":32193,"cogs":15625,"gross_margin":16568,"gm_pct":51.5,"bags":0},{"month":"2024-01","core_cleans":571,"project_cleans":58,"grant_cleans":9,"total_cleans":638,"revenue":33933,"cogs":16538,"gross_margin":17395,"gm_pct":51.3,"bags":0},{"month":"2024-02","core_cleans":572,"project_cleans":96,"grant_cleans":0,"total_cleans":668,"revenue":35195,"cogs":17250,"gross_margin":17945,"gm_pct":51.0,"bags":0},{"month":"2024-03","core_cleans":593,"project_cleans":92,"grant_cleans":0,"total_cleans":685,"revenue":36189,"cogs":17663,"gross_margin":18526,"gm_pct":51.2,"bags":0},{"month":"2024-04","core_cleans":610,"project_cleans":101,"grant_cleans":0,"total_cleans":711,"revenue":37283,"cogs":18300,"gross_margin":18983,"gm_pct":50.9,"bags":0},{"month":"2024-05","core_cleans":594,"project_cleans":105,"grant_cleans":0,"total_cleans":699,"revenue":36683,"cogs":18000,"gross_margin":18683,"gm_pct":50.9,"bags":0},{"month":"2024-06","core_cleans":549,"project_cleans":92,"grant_cleans":0,"total_cleans":641,"revenue":33999,"cogs":16550,"gross_margin":17449,"gm_pct":51.3,"bags":0},{"month":"2024-07","core_cleans":711,"project_cleans":118,"grant_cleans":0,"total_cleans":829,"revenue":43270,"cogs":21313,"gross_margin":21958,"gm_pct":50.7,"bags":0},{"month":"2024-08","core_cleans":741,"project_cleans":123,"grant_cleans":0,"total_cleans":864,"revenue":45276,"cogs":22225,"gross_margin":23051,"gm_pct":50.9,"bags":0},{"month":"2024-09","core_cleans":697,"project_cleans":111,"grant_cleans":0,"total_cleans":808,"revenue":41883,"cogs":20813,"gross_margin":21070,"gm_pct":50.3,"bags":0},{"month":"2024-10","core_cleans":743,"project_cleans":111,"grant_cleans":0,"total_cleans":854,"revenue":43970,"cogs":21938,"gross_margin":22033,"gm_pct":50.1,"bags":0},{"month":"2024-11","core_cleans":724,"project_cleans":106,"grant_cleans":0,"total_cleans":830,"revenue":43458,"cogs":21488,"gross_margin":21970,"gm_pct":50.6,"bags":0},{"month":"2024-12","core_cleans":799,"project_cleans":120,"grant_cleans":0,"total_cleans":919,"revenue":48199,"cogs":23813,"gross_margin":24386,"gm_pct":50.6,"bags":0},{"month":"2025-01","core_cleans":821,"project_cleans":121,"grant_cleans":0,"total_cleans":942,"revenue":49370,"cogs":24375,"gross_margin":24995,"gm_pct":50.6,"bags":0},{"month":"2025-02","core_cleans":727,"project_cleans":100,"grant_cleans":0,"total_cleans":827,"revenue":43495,"cogs":21438,"gross_margin":22058,"gm_pct":50.7,"bags":0},{"month":"2025-03","core_cleans":744,"project_cleans":124,"grant_cleans":0,"total_cleans":868,"revenue":46014,"cogs":22650,"gross_margin":23364,"gm_pct":50.8,"bags":0},{"month":"2025-04","core_cleans":729,"project_cleans":127,"grant_cleans":1,"total_cleans":857,"revenue":45370,"cogs":22350,"gross_margin":23020,"gm_pct":50.7,"bags":0},{"month":"2025-05","core_cleans":737,"project_cleans":140,"grant_cleans":1,"total_cleans":878,"revenue":46508,"cogs":22888,"gross_margin":23620,"gm_pct":50.8,"bags":0},{"month":"2025-06","core_cleans":731,"project_cleans":184,"grant_cleans":1,"total_cleans":916,"revenue":48496,"cogs":23800,"gross_margin":24696,"gm_pct":50.9,"bags":221},{"month":"2025-07","core_cleans":793,"project_cleans":159,"grant_cleans":601,"total_cleans":1553,"revenue":81633,"cogs":40325,"gross_margin":41308,"gm_pct":50.6,"bags":1684},{"month":"2025-08","core_cleans":799,"project_cleans":130,"grant_cleans":1069,"total_cleans":1998,"revenue":104764,"cogs":51463,"gross_margin":53301,"gm_pct":50.9,"bags":2754},{"month":"2025-09","core_cleans":797,"project_cleans":153,"grant_cleans":1329,"total_cleans":2279,"revenue":119320,"cogs":58450,"gross_margin":60870,"gm_pct":51.0,"bags":3125},{"month":"2025-10","core_cleans":778,"project_cleans":111,"grant_cleans":1528,"total_cleans":2417,"revenue":127773,"cogs":61813,"gross_margin":65960,"gm_pct":51.6,"bags":3422},{"month":"2025-11","core_cleans":744,"project_cleans":140,"grant_cleans":1382,"total_cleans":2266,"revenue":120020,"cogs":57938,"gross_margin":62083,"gm_pct":51.7,"bags":3447},{"month":"2025-12","core_cleans":839,"project_cleans":140,"grant_cleans":1524,"total_cleans":2503,"revenue":132745,"cogs":64338,"gross_margin":68408,"gm_pct":51.5,"bags":3410},{"month":"2026-01","core_cleans":799,"project_cleans":142,"grant_cleans":1486,"total_cleans":2427,"revenue":128901,"cogs":62175,"gross_margin":66726,"gm_pct":51.8,"bags":2828},{"month":"2026-02","core_cleans":745,"project_cleans":127,"grant_cleans":1333,"total_cleans":2205,"revenue":116139,"cogs":56255,"gross_margin":59884,"gm_pct":51.6,"bags":2295},{"month":"2026-03","core_cleans":920,"project_cleans":123,"grant_cleans":1462,"total_cleans":2505,"revenue":131164,"cogs":63875,"gross_margin":67289,"gm_pct":51.3,"bags":2954},{"month":"2026-04","core_cleans":909,"project_cleans":134,"grant_cleans":711,"total_cleans":1754,"revenue":92508,"cogs":45420,"gross_margin":47088,"gm_pct":50.9,"bags":2048},{"month":"2026-05","core_cleans":873,"project_cleans":117,"grant_cleans":276,"total_cleans":1266,"revenue":67111,"cogs":33320,"gross_margin":33791,"gm_pct":50.4,"bags":1477},{"month":"2026-06","core_cleans":835,"project_cleans":133,"grant_cleans":280,"total_cleans":1248,"revenue":65995,"cogs":32775,"gross_margin":33220,"gm_pct":50.3,"bags":1477},{"month":"2026-07","core_cleans":639,"project_cleans":110,"grant_cleans":197,"total_cleans":946,"revenue":49791,"cogs":24790,"gross_margin":25001,"gm_pct":50.2,"bags":1110}];

const BLOCKS = [{"month":"2022-01","core_active":30,"proj_active":0,"total_active":30,"new_core":7,"new_proj":0,"churned":0,"net":7},{"month":"2022-02","core_active":39,"proj_active":0,"total_active":39,"new_core":9,"new_proj":0,"churned":0,"net":9},{"month":"2022-03","core_active":47,"proj_active":0,"total_active":47,"new_core":15,"new_proj":0,"churned":7,"net":8},{"month":"2022-04","core_active":54,"proj_active":0,"total_active":54,"new_core":7,"new_proj":0,"churned":0,"net":7},{"month":"2022-05","core_active":74,"proj_active":0,"total_active":74,"new_core":22,"new_proj":0,"churned":2,"net":20},{"month":"2022-06","core_active":86,"proj_active":0,"total_active":86,"new_core":12,"new_proj":0,"churned":0,"net":12},{"month":"2022-07","core_active":90,"proj_active":0,"total_active":90,"new_core":5,"new_proj":0,"churned":1,"net":4},{"month":"2022-08","core_active":99,"proj_active":0,"total_active":99,"new_core":10,"new_proj":0,"churned":1,"net":9},{"month":"2022-09","core_active":100,"proj_active":0,"total_active":100,"new_core":5,"new_proj":0,"churned":4,"net":1},{"month":"2022-10","core_active":169,"proj_active":0,"total_active":169,"new_core":77,"new_proj":0,"churned":8,"net":69},{"month":"2022-11","core_active":154,"proj_active":0,"total_active":154,"new_core":21,"new_proj":0,"churned":36,"net":-15},{"month":"2022-12","core_active":149,"proj_active":0,"total_active":149,"new_core":9,"new_proj":0,"churned":14,"net":-5},{"month":"2023-01","core_active":152,"proj_active":0,"total_active":152,"new_core":10,"new_proj":0,"churned":7,"net":3},{"month":"2023-02","core_active":161,"proj_active":0,"total_active":161,"new_core":11,"new_proj":0,"churned":2,"net":9},{"month":"2023-03","core_active":186,"proj_active":0,"total_active":186,"new_core":30,"new_proj":0,"churned":5,"net":25},{"month":"2023-04","core_active":189,"proj_active":8,"total_active":197,"new_core":11,"new_proj":8,"churned":8,"net":11},{"month":"2023-05","core_active":201,"proj_active":8,"total_active":209,"new_core":14,"new_proj":0,"churned":2,"net":12},{"month":"2023-06","core_active":206,"proj_active":11,"total_active":217,"new_core":10,"new_proj":3,"churned":5,"net":8},{"month":"2023-07","core_active":210,"proj_active":16,"total_active":226,"new_core":9,"new_proj":5,"churned":5,"net":9},{"month":"2023-08","core_active":215,"proj_active":16,"total_active":231,"new_core":9,"new_proj":0,"churned":4,"net":5},{"month":"2023-09","core_active":217,"proj_active":16,"total_active":233,"new_core":7,"new_proj":2,"churned":7,"net":2},{"month":"2023-10","core_active":218,"proj_active":15,"total_active":233,"new_core":11,"new_proj":2,"churned":13,"net":0},{"month":"2023-11","core_active":222,"proj_active":15,"total_active":237,"new_core":8,"new_proj":0,"churned":4,"net":4},{"month":"2023-12","core_active":223,"proj_active":18,"total_active":241,"new_core":6,"new_proj":5,"churned":7,"net":4},{"month":"2024-01","core_active":229,"proj_active":21,"total_active":250,"new_core":7,"new_proj":3,"churned":3,"net":7},{"month":"2024-02","core_active":232,"proj_active":26,"total_active":258,"new_core":9,"new_proj":9,"churned":8,"net":10},{"month":"2024-03","core_active":248,"proj_active":26,"total_active":274,"new_core":15,"new_proj":0,"churned":1,"net":14},{"month":"2024-04","core_active":258,"proj_active":26,"total_active":284,"new_core":16,"new_proj":0,"churned":4,"net":12},{"month":"2024-05","core_active":254,"proj_active":26,"total_active":280,"new_core":0,"new_proj":0,"churned":4,"net":-4},{"month":"2024-06","core_active":267,"proj_active":26,"total_active":293,"new_core":8,"new_proj":0,"churned":0,"net":8},{"month":"2024-07","core_active":296,"proj_active":34,"total_active":330,"new_core":35,"new_proj":8,"churned":2,"net":41},{"month":"2024-08","core_active":303,"proj_active":35,"total_active":338,"new_core":11,"new_proj":1,"churned":4,"net":8},{"month":"2024-09","core_active":307,"proj_active":35,"total_active":342,"new_core":15,"new_proj":0,"churned":10,"net":5},{"month":"2024-10","core_active":313,"proj_active":35,"total_active":348,"new_core":13,"new_proj":0,"churned":7,"net":6},{"month":"2024-11","core_active":330,"proj_active":35,"total_active":365,"new_core":20,"new_proj":0,"churned":3,"net":17},{"month":"2024-12","core_active":330,"proj_active":35,"total_active":365,"new_core":7,"new_proj":0,"churned":7,"net":0},{"month":"2025-01","core_active":334,"proj_active":35,"total_active":369,"new_core":9,"new_proj":0,"churned":5,"net":4},{"month":"2025-02","core_active":332,"proj_active":35,"total_active":367,"new_core":3,"new_proj":0,"churned":5,"net":-2},{"month":"2025-03","core_active":325,"proj_active":37,"total_active":362,"new_core":6,"new_proj":2,"churned":14,"net":-6},{"month":"2025-04","core_active":322,"proj_active":39,"total_active":361,"new_core":5,"new_proj":2,"churned":7,"net":0},{"month":"2025-05","core_active":324,"proj_active":39,"total_active":363,"new_core":6,"new_proj":0,"churned":4,"net":2},{"month":"2025-06","core_active":316,"proj_active":41,"total_active":357,"new_core":4,"new_proj":2,"churned":12,"net":-6},{"month":"2025-07","core_active":319,"proj_active":577,"total_active":896,"new_core":8,"new_proj":535,"churned":5,"net":538},{"month":"2025-08","core_active":322,"proj_active":704,"total_active":1026,"new_core":9,"new_proj":129,"churned":7,"net":131},{"month":"2025-09","core_active":321,"proj_active":736,"total_active":1057,"new_core":4,"new_proj":26,"churned":5,"net":25},{"month":"2025-10","core_active":315,"proj_active":740,"total_active":1055,"new_core":2,"new_proj":10,"churned":8,"net":4},{"month":"2025-11","core_active":313,"proj_active":740,"total_active":1053,"new_core":3,"new_proj":0,"churned":6,"net":-3},{"month":"2025-12","core_active":314,"proj_active":740,"total_active":1054,"new_core":6,"new_proj":0,"churned":5,"net":1},{"month":"2026-01","core_active":318,"proj_active":711,"total_active":1029,"new_core":11,"new_proj":0,"churned":35,"net":-24},{"month":"2026-02","core_active":319,"proj_active":711,"total_active":1030,"new_core":5,"new_proj":0,"churned":4,"net":1},{"month":"2026-03","core_active":331,"proj_active":700,"total_active":1031,"new_core":17,"new_proj":0,"churned":16,"net":1},{"month":"2026-04","core_active":342,"proj_active":618,"total_active":960,"new_core":12,"new_proj":1,"churned":84,"net":-71},{"month":"2026-05","core_active":340,"proj_active":183,"total_active":523,"new_core":8,"new_proj":0,"churned":445,"net":-437},{"month":"2026-06","core_active":374,"proj_active":180,"total_active":554,"new_core":35,"new_proj":0,"churned":4,"net":31},{"month":"2026-07","core_active":306,"proj_active":168,"total_active":474,"new_core":0,"new_proj":0,"churned":80,"net":-80}];

const C = { core:"#2563eb", project:"#8b5cf6", grant:"#14b8a6", revenue:"#f97316", bags:"#eab308", margin:"#10b981", coreBlock:"#1a7a4a", projBlock:"#5db88a", churn:"#dc2626", net:"#1e293b" };
const shortM = m => { const ms=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; const [y,mo]=m.split("-"); return `${ms[+mo-1]} '${y.slice(2)}`; };
const fD = n => `$${(n/1000).toFixed(n>=10000?0:1)}K`;
const fFull = n => `$${Math.round(n).toLocaleString()}`;

const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:6,padding:"8px 12px",fontSize:11,boxShadow:"0 2px 8px rgba(0,0,0,.08)"}}>
    <div style={{fontWeight:600,marginBottom:3}}>{shortM(label)}</div>
    {payload.map((p,i)=><div key={i} style={{display:"flex",gap:6,alignItems:"center",marginBottom:1}}>
      <span style={{width:8,height:8,borderRadius:2,background:p.color,flexShrink:0}}/>
      <span style={{color:"#64748b"}}>{p.name}:</span>
      <span style={{fontWeight:500}}>{typeof p.value==="number"?(p.dataKey?.includes("rev")||p.dataKey?.includes("cogs")||p.dataKey?.includes("margin")?fFull(p.value):p.value.toLocaleString()):p.value}</span>
    </div>)}
  </div>;
};

function Stat({label,value,sub,color="#2563eb"}) {
  return <div style={{flex:1,minWidth:130,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 14px",textAlign:"center"}}>
    <div style={{fontSize:10,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
    <div style={{fontSize:24,fontWeight:700,color,marginTop:2}}>{value}</div>
    {sub&&<div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>{sub}</div>}
  </div>;
}

function TabBtn({active,children,onClick}) {
  return <button onClick={onClick} style={{padding:"8px 20px",borderRadius:8,border:"1px solid "+(active?"#1e293b":"#e2e8f0"),fontSize:13,fontWeight:500,cursor:"pointer",background:active?"#1e293b":"#fff",color:active?"#fff":"#64748b",transition:"all .15s"}}>{children}</button>;
}

function FilterBtn({active,children,onClick}) {
  return <button onClick={onClick} style={{padding:"4px 12px",borderRadius:5,border:"1px solid "+(active?"#1e293b":"#d1d5db"),fontSize:11,fontWeight:500,cursor:"pointer",background:active?"#1e293b":"#fff",color:active?"#fff":"#64748b"}}>{children}</button>;
}

const xTick = (data) => (val, idx) => {
  if(data.length<=24) return shortM(val);
  const mo=parseInt(val.split("-")[1]);
  return (mo===1||mo===7)?shortM(val):"";
};

export default function Dashboard() {
  const [tab, setTab] = useState("cleans");
  const [tableOpen, setTableOpen] = useState(false);
  const [blockFilter, setBlockFilter] = useState("all");

  const cTotals = useMemo(()=>({
    cleans:CLEANS.reduce((s,d)=>s+d.total_cleans,0),
    rev:CLEANS.reduce((s,d)=>s+d.revenue,0),
    cogs:CLEANS.reduce((s,d)=>s+d.cogs,0),
    bags:CLEANS.reduce((s,d)=>s+d.bags,0),
  }),[]);

  const lastFull = CLEANS[CLEANS.length-2];
  const bLast = BLOCKS[BLOCKS.length-1];
  const bLastFull = BLOCKS[BLOCKS.length-2];

  const cleanChart = useMemo(()=>CLEANS.map(d=>({...d,revK:d.revenue/1000})),[]);
  const bagsChart = useMemo(()=>CLEANS.filter(d=>d.bags>0),[]);

  const blockChart = useMemo(()=>{
    if(blockFilter==="all") return BLOCKS;
    return BLOCKS.map(b=>blockFilter==="core"
      ?{...b,display_active:b.core_active,new_total:b.new_core,churned_display:Math.round(b.churned*(b.core_active/(b.total_active||1)))}
      :{...b,display_active:b.proj_active,new_total:b.new_proj,churned_display:Math.round(b.churned*(b.proj_active/(b.total_active||1)))});
  },[blockFilter]);

  const flowChart = useMemo(()=>BLOCKS.map(b=>{
    const nc=blockFilter==="project"?0:b.new_core;
    const np=blockFilter==="core"?0:b.new_proj;
    const ch=blockFilter==="all"?b.churned:Math.round(b.churned*(blockFilter==="core"?b.core_active:b.proj_active)/(b.total_active||1));
    return {...b,new_core_d:nc,new_proj_d:np,churned_neg:-ch,net_d:nc+np-ch};
  }),[blockFilter]);

  const exportCSV = () => {
    const h=["Month","Core Cleans","Proj Cleans","Grant Cleans","Total","Revenue","COGS","Margin","GM%","Bags","Core Blocks","Proj Blocks","Total Blocks","New","Churned","Net"];
    const rows=CLEANS.map(d=>{
      const b=BLOCKS.find(x=>x.month===d.month);
      return [d.month,d.core_cleans,d.project_cleans,d.grant_cleans,d.total_cleans,d.revenue,d.cogs,d.gross_margin,d.gm_pct+"%",d.bags,b?.core_active||"",b?.proj_active||"",b?.total_active||"",b?(b.new_core+b.new_proj):"",b?.churned||"",b?.net||""].join(",");
    });
    const csv=[h.join(","),...rows].join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="glitter_ops_summary.csv";a.click();
  };

  return <div style={{fontFamily:"'Inter',system-ui,sans-serif",maxWidth:880,margin:"0 auto",padding:"14px 12px",color:"#1e293b"}}>
    <div style={{marginBottom:16}}>
      <h1 style={{fontSize:20,fontWeight:700,margin:0,letterSpacing:"-.4px"}}>Glitter Operations Dashboard</h1>
      <p style={{fontSize:11,color:"#94a3b8",margin:"3px 0 0"}}>Single source of truth · Cleaning log + Block data from Airtable · Snapshot {new Date().toLocaleDateString()}</p>
    </div>

    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <TabBtn active={tab==="cleans"} onClick={()=>setTab("cleans")}>Cleaning & Revenue</TabBtn>
      <TabBtn active={tab==="blocks"} onClick={()=>setTab("blocks")}>Block Growth</TabBtn>
      <TabBtn active={tab==="table"} onClick={()=>setTab("table")}>Data Table</TabBtn>
      <button onClick={exportCSV} style={{marginLeft:"auto",padding:"6px 14px",borderRadius:6,border:"none",background:"#2563eb",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>Export CSV</button>
    </div>

    {tab==="cleans"&&<>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        <Stat label="Total Cleans" value={cTotals.cleans.toLocaleString()} sub="since Sep '21"/>
        <Stat label="Bags Diverted" value={`${(cTotals.bags/1000).toFixed(1)}K`} sub="scored from Jun '25" color="#eab308"/>
        <Stat label="Last Full Month" value={lastFull.total_cleans.toLocaleString()} sub={shortM(lastFull.month)}/>
        <Stat label="All-Time Revenue" value={fD(cTotals.rev)} sub={`${((cTotals.rev-cTotals.cogs)/cTotals.rev*100).toFixed(0)}% GM`} color="#10b981"/>
      </div>

      <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"14px 8px 8px",marginBottom:14}}>
        <div style={{padding:"0 12px",marginBottom:6}}>
          <div style={{fontSize:13,fontWeight:600}}>Cleans per Month</div>
          <div style={{fontSize:10,color:"#94a3b8"}}>Stacked Core / Project / Grant — Revenue line (right axis)</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={cleanChart} margin={{top:4,right:36,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
            <XAxis dataKey="month" tick={{fontSize:9,fill:"#94a3b8"}} tickFormatter={xTick(cleanChart)} interval={0}/>
            <YAxis yAxisId="l" tick={{fontSize:10,fill:"#94a3b8"}} tickFormatter={v=>v>=1000?`${v/1000}K`:v}/>
            <YAxis yAxisId="r" orientation="right" tick={{fontSize:10,fill:C.revenue}} tickFormatter={v=>`$${v}K`}/>
            <Tooltip content={<Tip/>}/>
            <Bar yAxisId="l" dataKey="core_cleans" stackId="c" fill={C.core} name="Core" radius={[0,0,0,0]}/>
            <Bar yAxisId="l" dataKey="project_cleans" stackId="c" fill={C.project} name="Project"/>
            <Bar yAxisId="l" dataKey="grant_cleans" stackId="c" fill={C.grant} name="Grant" radius={[2,2,0,0]}/>
            <Line yAxisId="r" dataKey="revK" stroke={C.revenue} strokeWidth={2} dot={false} name="Revenue ($K)"/>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:12,padding:"6px 12px 0",fontSize:10,color:"#64748b",flexWrap:"wrap"}}>
          {[["Core",C.core],["Project",C.project],["Grant",C.grant]].map(([n,c])=><span key={n} style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:9,height:9,background:c,borderRadius:2}}/>{n}</span>)}
          <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:14,height:2,background:C.revenue,borderRadius:1}}/>Revenue</span>
        </div>
      </div>

      {bagsChart.length>0&&<div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"14px 8px 8px",marginBottom:14}}>
        <div style={{padding:"0 12px",marginBottom:6}}>
          <div style={{fontSize:13,fontWeight:600}}>Bags of Trash Diverted per Month</div>
          <div style={{fontSize:10,color:"#94a3b8"}}>Scoring began Jun '25. Rare=0.25, Light=0.5, Med=0.75, Heavy=1.25, Severe=2.0 bags.</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={bagsChart} margin={{top:4,right:20,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:"#94a3b8"}} tickFormatter={shortM}/>
            <YAxis tick={{fontSize:10,fill:"#94a3b8"}} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(1)}K`:v}/>
            <Tooltip content={<Tip/>}/>
            <Area type="monotone" dataKey="bags" stroke={C.bags} fill={C.bags} fillOpacity={.15} name="Bags" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>}

      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:280,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 8px 8px"}}>
          <div style={{fontSize:12,fontWeight:600,padding:"0 12px"}}>Revenue vs Gross Margin</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={cleanChart} margin={{top:8,right:16,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{fontSize:8,fill:"#94a3b8"}} tickFormatter={xTick(cleanChart)} interval={0}/>
              <YAxis tick={{fontSize:9,fill:"#94a3b8"}} tickFormatter={v=>`$${v/1000}K`}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="revenue" stroke={C.revenue} fill={C.revenue} fillOpacity={.08} name="Revenue" strokeWidth={1.5}/>
              <Area type="monotone" dataKey="gross_margin" stroke={C.margin} fill={C.margin} fillOpacity={.12} name="Gross Margin" strokeWidth={1.5}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{flex:1,minWidth:280,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 8px 8px"}}>
          <div style={{fontSize:12,fontWeight:600,padding:"0 12px"}}>Core Cleans Only (ex-Grant/Project)</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={cleanChart} margin={{top:8,right:16,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="month" tick={{fontSize:8,fill:"#94a3b8"}} tickFormatter={xTick(cleanChart)} interval={0}/>
              <YAxis tick={{fontSize:9,fill:"#94a3b8"}}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="core_cleans" fill={C.core} name="Core Cleans" radius={[2,2,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>}

    {tab==="blocks"&&<>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        <Stat label="Active Blocks" value={bLastFull.total_active.toLocaleString()} sub={shortM(bLastFull.month)} color="#1a7a4a"/>
        <Stat label="Core Blocks" value={bLastFull.core_active.toLocaleString()} sub="Resident/Community/Commercial" color="#1a7a4a"/>
        <Stat label="Project Blocks" value={bLastFull.proj_active.toLocaleString()} sub="Grant & project-funded" color="#5db88a"/>
        <Stat label="Churned Last Mo" value={bLastFull.churned.toLocaleString()} sub="last clean >35 days" color="#dc2626"/>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {["all","core","project"].map(f=><FilterBtn key={f} active={blockFilter===f} onClick={()=>setBlockFilter(f)}>{f==="all"?"All blocks":f==="core"?"Core only":"Project only"}</FilterBtn>)}
      </div>

      <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"14px 8px 8px",marginBottom:14}}>
        <div style={{padding:"0 12px",marginBottom:6}}>
          <div style={{fontSize:13,fontWeight:600}}>Cumulative Active Blocks</div>
          <div style={{fontSize:10,color:"#94a3b8"}}>Active = last clean within 35 days of month-end</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={BLOCKS} margin={{top:4,right:16,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
            <XAxis dataKey="month" tick={{fontSize:9,fill:"#94a3b8"}} tickFormatter={xTick(BLOCKS)} interval={0}/>
            <YAxis tick={{fontSize:10,fill:"#94a3b8"}}/>
            <Tooltip content={<Tip/>}/>
            {blockFilter!=="project"&&<Bar dataKey="core_active" stackId="b" fill={C.coreBlock} name="Core" radius={[0,0,0,0]}/>}
            {blockFilter!=="core"&&<Bar dataKey="proj_active" stackId="b" fill={C.projBlock} name="Project" radius={[2,2,0,0]}/>}
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:12,padding:"6px 12px 0",fontSize:10,color:"#64748b"}}>
          {blockFilter!=="project"&&<span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:9,height:9,background:C.coreBlock,borderRadius:2}}/>Core</span>}
          {blockFilter!=="core"&&<span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:9,height:9,background:C.projBlock,borderRadius:2}}/>Project/Grant</span>}
        </div>
      </div>

      <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"14px 8px 8px"}}>
        <div style={{padding:"0 12px",marginBottom:6}}>
          <div style={{fontSize:13,fontWeight:600}}>New Blocks vs Churned per Month</div>
          <div style={{fontSize:10,color:"#94a3b8"}}>First clean = onboarded · Last clean &gt;35 days ago = churned</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={flowChart} margin={{top:4,right:16,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
            <XAxis dataKey="month" tick={{fontSize:9,fill:"#94a3b8"}} tickFormatter={xTick(flowChart)} interval={0}/>
            <YAxis tick={{fontSize:10,fill:"#94a3b8"}}/>
            <Tooltip content={<Tip/>}/>
            {blockFilter!=="project"&&<Bar dataKey="new_core_d" stackId="n" fill={C.coreBlock} name="New Core"/>}
            {blockFilter!=="core"&&<Bar dataKey="new_proj_d" stackId="n" fill={C.projBlock} name="New Project"/>}
            <Bar dataKey="churned_neg" fill={C.churn} name="Churned"/>
            <Line dataKey="net_d" stroke={C.net} strokeWidth={2} dot={{r:2,fill:C.net}} name="Net Change" type="monotone"/>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:12,padding:"6px 12px 0",fontSize:10,color:"#64748b",flexWrap:"wrap"}}>
          {blockFilter!=="project"&&<span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:9,height:9,background:C.coreBlock,borderRadius:2}}/>New Core</span>}
          {blockFilter!=="core"&&<span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:9,height:9,background:C.projBlock,borderRadius:2}}/>New Project</span>}
          <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:9,height:9,background:C.churn,borderRadius:2}}/>Churned</span>
          <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:14,height:2,background:C.net,borderRadius:1}}/>Net</span>
        </div>
      </div>
    </>}

    {tab==="table"&&<div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,overflow:"auto"}}>
      <table style={{width:"100%",fontSize:10,borderCollapse:"collapse",minWidth:700}}>
        <thead><tr style={{background:"#e2e8f0"}}>
          {["Month","Core Cl","Proj Cl","Grant Cl","Total Cl","Revenue","COGS","Margin","GM%","Bags","Core Blk","Proj Blk","Total Blk","Churned","Net"].map(h=>
            <th key={h} style={{padding:"7px 4px",textAlign:h==="Month"?"left":"right",fontWeight:600,fontSize:9,whiteSpace:"nowrap"}}>{h}</th>)}
        </tr></thead>
        <tbody>{[...CLEANS].reverse().map((d,i)=>{
          const b=BLOCKS.find(x=>x.month===d.month);
          return <tr key={d.month} style={{borderBottom:"1px solid #f1f5f9",background:i===0?"#fffbeb":"transparent"}}>
            <td style={{padding:"5px 4px",fontWeight:500,whiteSpace:"nowrap"}}>{shortM(d.month)}{i===0?" *":""}</td>
            <td style={{padding:"5px 4px",textAlign:"right"}}>{d.core_cleans}</td>
            <td style={{padding:"5px 4px",textAlign:"right"}}>{d.project_cleans}</td>
            <td style={{padding:"5px 4px",textAlign:"right"}}>{d.grant_cleans}</td>
            <td style={{padding:"5px 4px",textAlign:"right",fontWeight:600}}>{d.total_cleans}</td>
            <td style={{padding:"5px 4px",textAlign:"right"}}>{fFull(d.revenue)}</td>
            <td style={{padding:"5px 4px",textAlign:"right"}}>{fFull(d.cogs)}</td>
            <td style={{padding:"5px 4px",textAlign:"right",color:"#10b981"}}>{fFull(d.gross_margin)}</td>
            <td style={{padding:"5px 4px",textAlign:"right"}}>{d.gm_pct}%</td>
            <td style={{padding:"5px 4px",textAlign:"right",color:d.bags?"#eab308":"#cbd5e1"}}>{d.bags||"—"}</td>
            <td style={{padding:"5px 4px",textAlign:"right",color:"#1a7a4a"}}>{b?.core_active||"—"}</td>
            <td style={{padding:"5px 4px",textAlign:"right",color:"#5db88a"}}>{b?.proj_active||"—"}</td>
            <td style={{padding:"5px 4px",textAlign:"right",fontWeight:500}}>{b?.total_active||"—"}</td>
            <td style={{padding:"5px 4px",textAlign:"right",color:"#dc2626"}}>{b?.churned||"—"}</td>
            <td style={{padding:"5px 4px",textAlign:"right",fontWeight:500}}>{b?b.net:"—"}</td>
          </tr>;})}
        </tbody>
      </table>
      <div style={{fontSize:9,color:"#94a3b8",padding:"6px 10px",fontStyle:"italic"}}>
        * Current month is partial. Block data starts Jan '22. Revenue = $50 x multiplier. COGS = cleaner payout field. Bags from Trash+Debris scores (Jun '25+). Churn = last clean &gt;35 days.
      </div>
    </div>}

    <div style={{fontSize:10,color:"#94a3b8",marginTop:14,lineHeight:1.5}}>
      Data pulled {new Date().toLocaleDateString()} from Airtable. Cleans: 49,459 Cleaning Log records (Sep '21–). Blocks: 1,421 blocks with clean history (Jan '22–). Jul '26 is partial.
    </div>
  </div>;
}
