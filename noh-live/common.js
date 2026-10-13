// 共通ヘルパー(ナビ・集計)
(function(){
  const pages=[["index.html","一覧"],["stats.html","分析"],["sources.html","データソース"]];
  const cur=(location.pathname.split("/").pop()||"index.html");
  window.mountNav=function(){
    const el=document.getElementById("top");
    el.innerHTML='<div class="wrap"><a class="brand" href="index.html">noh<i>/</i>live</a><nav>'+
      pages.map(p=>'<a href="'+p[0]+'"'+(p[0]===cur?' class="on"':'')+'>'+p[1]+'</a>').join("")+'</nav></div>';
  };
  window.esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  window.fmtDate=d=>d.replace(/-/g,"/");
  window.countBy=function(list,pick){
    const m=new Map();
    list.forEach(s=>pick(s).forEach(k=>{const e=m.get(k)||{n:0,last:"",first:"9999"};e.n++;if(s.date>e.last)e.last=s.date;if(s.date<e.first)e.first=s.date;m.set(k,e)}));
    return [...m.entries()].map(([k,v])=>({k,n:v.n,last:v.last,first:v.first})).sort((a,b)=>b.n-a.n||b.last.localeCompare(a.last)||a.k.localeCompare(b.k,"ja"));
  };
  // 情報源の判定: 公式サイトSHOWSは2024-05-03以降。それ以前はX(@NOH_JP)の告知
  window.srcOf=function(s){
    if(s.upcoming) return "x";
    if(s.date>="2024-05-03") return "official";
    return "x";
  };
  window.played=()=>window.SHOWS.filter(s=>!s.upcoming);
})();

// データ読み込み: Supabase(アプリと共通)を優先し、失敗したら同梱のshows.jsを使う
window.shows_ready=(async function(){
  try{
    const r=await fetch("https://bcxwfosythkuwdmkwkkj.supabase.co/rest/v1/lives?select=*&limit=5000",{headers:{apikey:"sb_publishable_M1RuhvoQzl7D6To4FR2NYQ_LvNnA5bW"}});
    if(!r.ok) throw new Error(r.status);
    const rows=await r.json();
    if(!rows.length) throw new Error("empty");
    const today=new Date(Date.now()+9*3600e3).toISOString().slice(0,10);
    window.SHOWS=rows.filter(l=>l["日にち"]&&l["ステータス"]!=="中止").map(l=>({
      date:String(l["日にち"]).slice(0,10), title:l["ライブタイトル"]||"", venue:l["ライブ場所"]||"(会場未確認)",
      pref:l["都道府県"]||"不明", acts:Array.isArray(l["対バン"])?l["対バン"]:[], open:l["開場"]||"", start:l["開演"]||"",
      price:l["料金"]||(l["チケット代"]?("¥"+l["チケット代"]):""), note:l["備考"]||"", era:l["時代"]||"noh",
      upcoming:String(l["日にち"]).slice(0,10)>today
    })).sort((a,b)=>b.date.localeCompare(a.date));
    window.SHOWS_SOURCE="supabase";
  }catch(e){ window.SHOWS_SOURCE="static"; console.warn("Supabase読み込み失敗。同梱データを使用",e); }
})();
