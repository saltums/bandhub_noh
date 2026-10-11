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
