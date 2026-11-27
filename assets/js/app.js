const $=s=>document.querySelector(s);
let nodes=[],edges=[],selectedCollection="all",collectionQuery="",historyData={events:[],people:[],eras:[]},activeEra="all";
let saved=JSON.parse(localStorage.getItem("tc-saved")||"[]");
const colors={Technology:"#657d86",Science:"#a16b52",History:"#9a7851",Culture:"#75836b",Geography:"#64858a",Humanity:"#9a6d78",Mathematics:"#8575a6",Medicine:"#a66f78",Space:"#617c9c","Arts & Literature":"#a07855","Politics & Society":"#88745f",Environment:"#66836a"};
const mediaCache=new Map();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function pageTitle(n){if(n.wiki){const p=n.wiki.split("/wiki/")[1];if(p)return decodeURIComponent(p.replace(/_/g," "))}return n.title}
async function getMedia(n){if(mediaCache.has(n.id))return mediaCache.get(n.id);const task=(async()=>{try{const url="https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(pageTitle(n));const res=await fetch(url);if(!res.ok)return null;const data=await res.json();return{image:data.thumbnail?.source||data.originalimage?.source||null,extract:data.extract||null,source:data.content_urls?.desktop?.page||n.wiki||null}}catch(e){return null}})();mediaCache.set(n.id,task);return task}
function paintImage(el,url){if(url){el.style.backgroundImage="url('"+url.replace(/'/g,"%27")+"')";el.classList.add("has-image")}}
async function loadMedia(n,el){const media=await getMedia(n);if(media?.image&&el.isConnected)paintImage(el,media.image);return media}
async function loadData(){const [nr,er,hr]=await Promise.all([fetch("data/nodes.json?v=6").then(r=>{if(!r.ok)throw Error("nodes");return r.json()}),fetch("data/connections.json?v=6").then(r=>{if(!r.ok)throw Error("connections");return r.json()}),fetch("data/history.json?v=1").then(r=>{if(!r.ok)throw Error("history");return r.json()})]);nodes=nr;edges=er;historyData=hr;$("#nodeStat").textContent=nodes.length;$("#edgeStat").textContent=edges.length;$("#domainStat").textContent=new Set(nodes.map(n=>n.category)).size.toString().padStart(2,"0");$("#atlasCount").textContent=nodes.length;renderCollectionBrowser();renderFeatured();renderDailyFeatures();renderJourneys();fillSelects();renderTimeline();updateSavedCount();loadMedia(nodes.find(n=>n.id==="bigbang"),$("#heroImageMain"));loadMedia(nodes.find(n=>n.id==="bengal"),$("#heroImageSmall"))}
const collectionInfo={"Technology":["How tools, machines and networks reshape everyday life.","computer"],"Science":["The questions, experiments and discoveries that explain our universe.","einstein"],"History":["The turning points, empires and movements that made the present.","liberation"],"Geography":["Landscapes, places and natural systems that shape human life.","sundarbans"],"Culture":["Art, belief and shared ideas that travel across generations.","renaissance"],"Humanity":["The institutions and ideas through which societies organise themselves.","dhakauniversity"],"Mathematics":["The language of patterns, quantities and logical thinking.","algebra"],"Medicine":["Discoveries that changed how we understand and treat the human body.","penicillin"],"Space":["Our attempts to understand the cosmos and travel beyond Earth.","moon"],"Arts & Literature":["The creators and works that give shape to imagination.","leonardo"],"Politics & Society":["Power, citizenship and the systems that shape public life.","democracy"],"Environment":["The living planet, its changing climate and connected ecosystems.","climate"]};
function renderCollectionBrowser(){const cats=[...new Set(nodes.map(n=>n.category))].sort((a,b)=>a.localeCompare(b));$("#collectionGrid").innerHTML=cats.map((cat,i)=>{const info=collectionInfo[cat]||["Explore this field of knowledge.",nodes.find(n=>n.category===cat)?.id],count=nodes.filter(n=>n.category===cat).length;return '<button class="collection-tile" data-category="'+esc(cat)+'" aria-pressed="false"><span class="collection-tile-number">'+String(i+1).padStart(2,"0")+'</span><span class="collection-tile-image" id="collectionImage'+i+'"></span><span class="collection-tile-copy"><strong>'+esc(cat)+'</strong><small>'+count+' SUBJECTS</small><span class="collection-tile-description">'+esc(info[0])+'</span><span class="collection-tile-arrow">Explore collection ↗</span></span></button>'}).join("");cats.forEach((cat,i)=>{const id=(collectionInfo[cat]||[])[1],n=nodes.find(x=>x.id===id)||nodes.find(x=>x.category===cat);if(n)loadMedia(n,$("#collectionImage"+i))});$("#collectionGrid").querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>selectCollection(b.dataset.category));selectCollection("all")}
function selectCollection(cat){selectedCollection=cat;$("#collectionGrid").querySelectorAll(".collection-tile").forEach(b=>{b.classList.toggle("active",b.dataset.category===cat);b.setAttribute("aria-pressed",String(b.dataset.category===cat))});const info=collectionInfo[cat],list=cat==="all"?nodes:nodes.filter(n=>n.category===cat);$("#collectionTitle").textContent=cat==="all"?"All subjects":cat;$("#collectionDescription").textContent=cat==="all"?"A little bit of everything, waiting to be explored.":(info?.[0]||"Explore this collection.");collectionQuery="";$("#collectionSearch").value="";renderCollectionSubjects(list)}
function renderCollectionSubjects(list){const filtered=list.filter(n=>(n.title+" "+n.short+" "+n.description+" "+n.type).toLowerCase().includes(collectionQuery)),shown=filtered.slice(0,12);$("#collectionSubjects").innerHTML=shown.map((n,i)=>'<button class="collection-subject" data-id="'+esc(n.id)+'"><span class="collection-subject-image" id="subjectImage'+i+'"></span><span class="collection-subject-meta">'+esc(n.category)+' · '+esc(n.year||n.type||"")+'</span><strong>'+esc(n.title)+'</strong><span class="collection-subject-summary">'+esc(n.short||n.description)+'</span><span class="collection-subject-link">Read the story ↗</span></button>').join("")||'<p class="collection-empty">No subjects match that search. Try another word.</p>';shown.forEach((n,i)=>loadMedia(n,$("#subjectImage"+i)));$("#collectionSubjects").querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>openTopic(b.dataset.id));$("#collectionMore").textContent=filtered.length>12?"Showing 12 of "+filtered.length+" subjects. Use search to narrow the collection.":filtered.length+" subjects in this view"}


function relatedTo(id){return edges.filter(e=>e.from===id||e.to===id).map(e=>({edge:e,node:nodes.find(n=>n.id===(e.from===id?e.to:e.from))})).filter(x=>x.node)}
async function openTopic(id){
 const n=nodes.find(x=>x.id===id);if(!n)return;
 const readMinutes=Math.max(1,Math.ceil(((n.description||"")+" "+(n.short||"")).trim().split(/\s+/).filter(Boolean).length/200));
 const linked=relatedTo(id),year=n.year||"Ongoing";
 const events=historyData.events.filter(e=>e.topicId===id);
 const people=historyData.people.filter(p=>p.topicId===id);
 const sourceItems=[];
 const addSource=(label,url,kind)=>{if(url&&!sourceItems.some(x=>x.url===url))sourceItems.push({label,url,kind})};
 addSource("Wikipedia article",n.wiki,"Further reading");
 events.forEach(e=>addSource(e.source,e.url,"Historical reference"));
 people.forEach(p=>addSource(p.source,p.url,"Biographical reference"));
 const archiveCount=events.length+people.length;
 const nextReads=linked.slice().sort((a,b)=>{
   const aDifferent=a.node.category!==n.category?1:0,bDifferent=b.node.category!==n.category?1:0;
   return bDifferent-aDifferent;
 }).slice(0,3);
 $("#detailContent").innerHTML=
 '<article class="reader">'+
 '<div class="reader-image-wrap"><div class="detail-image reader-image" id="detailImage"></div><span class="reader-image-caption" id="imageCaption">A visual reference for this subject</span></div>'+
 '<div class="reader-body">'+
 '<div class="reader-eyebrow"><span>'+esc(n.category.toUpperCase())+'</span><span>FIELD NOTES · '+esc((n.type||"SUBJECT").toUpperCase())+'</span><span> '+readMinutes+' MIN READ</span></div>'+
 '<h2 class="reader-title">'+esc(n.title)+'</h2><p class="reader-deck">'+esc(n.short||n.description)+'</p>'+
 '<div class="reader-facts reader-facts-expanded">'+
 '<div><small>DATE / PERIOD</small><strong>'+esc(year)+'</strong></div>'+
 '<div><small>COLLECTION</small><strong>'+esc(n.category)+'</strong></div>'+
 '<div><small>SUBJECT TYPE</small><strong>'+esc(n.type||"Topic")+'</strong></div>'+
 '<div><small>DIRECT CONNECTIONS</small><strong>'+linked.length+'</strong></div>'+
 '</div>'+
 '<section class="reader-section"><p class="reader-section-label">01 / THE STORY</p><h3>What it is, and why it matters</h3><p class="reader-prose">'+esc(n.description)+'</p>'+
 '<div class="reader-wiki" id="wikiExtract" hidden><p class="reader-section-label">ADDITIONAL CONTEXT · WIKIPEDIA</p><p class="reader-prose" id="wikiExtractText"></p><a class="reader-inline-source" id="wikiArticleLink" href="'+esc(n.wiki||"#")+'" target="_blank" rel="noopener noreferrer">Read the full article ↗</a></div></section>'+
 (events.length?'<section class="reader-section"><p class="reader-section-label">02 / IN THE HISTORICAL RECORD</p><h3>Moments that matter</h3><p class="reader-section-intro">Milestones in the archive that are directly associated with this subject.</p><div class="reader-event-list">'+events.map(e=>'<article class="reader-event"><time>'+esc(e.date)+'</time><div><strong>'+esc(e.title)+'</strong><p>'+esc(e.summary)+'</p><a href="'+esc(e.url)+'" target="_blank" rel="noopener noreferrer">'+esc(e.source)+' ↗</a></div></article>').join("")+'</div></section>':'')+
 (people.length?'<section class="reader-section"><p class="reader-section-label">03 / PEOPLE IN THIS STORY</p><h3>People to know</h3><div class="reader-people-list">'+people.map(p=>'<article class="reader-person"><div><strong>'+esc(p.name)+'</strong><small>'+esc(p.life||"")+' · '+esc(p.role||"")+'</small><p>'+esc(p.bio)+'</p><a href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">'+esc(p.source)+' ↗</a></div></article>').join("")+'</div></section>':'')+
 '<section class="reader-section"><p class="reader-section-label">04 / THE BIGGER PICTURE</p><h3>Connections that explain the story</h3><p class="reader-section-intro">Each note below describes the recorded link between this subject and another part of the atlas. Follow one to see the next piece of the story.</p><div class="reader-related">'+
 (linked.length?linked.map(x=>'<button class="reader-related-item" data-id="'+esc(x.node.id)+'"><span class="reader-related-main"><strong>'+esc(x.node.title)+'</strong><small>'+esc(x.node.category)+' · '+esc(x.node.year||x.node.type||"")+'</small></span><span class="reader-relationship"><small>WHY IT CONNECTS</small>'+esc(x.edge.label)+'</span><span class="reader-arrow">↗</span></button>').join(""):'<p class="reader-note">No direct connections have been recorded for this subject yet.</p>')+
 '</div></section>'+
 (nextReads.length?'<section class="reader-section reader-next-section"><p class="reader-section-label">05 / KEEP EXPLORING</p><h3>Where to go next</h3><p class="reader-section-intro">A few connected subjects that open a different door into the same story.</p><div class="reader-next-grid">'+nextReads.map((x,i)=>'<button class="reader-next-card" data-id="'+esc(x.node.id)+'"><span class="reader-next-image" id="readerNextImage'+i+'"></span><span class="reader-next-category">'+esc(x.node.category.toUpperCase())+'</span><strong>'+esc(x.node.title)+'</strong><small>Explore this subject ↗</small></button>').join("")+'</div></section>':'')+
 '<section class="reader-sources"><p class="reader-section-label">SOURCES & FURTHER READING</p>'+
 (sourceItems.length?'<div class="reader-source-list">'+sourceItems.map(s=>'<a class="reader-source-link" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer"><span><strong>'+esc(s.label)+'</strong><small>'+esc(s.kind)+'</small></span><span>↗</span></a>').join("")+'</div>':'<p class="reader-note">No external reference has been added for this subject yet.</p>')+
 '<p class="reader-note">Summaries in this atlas are editorial paraphrases. Historical and biographical references are listed separately where available. Dates marked c. are approximate.</p></section>'+
 '<button class="save-topic reader-save" id="saveTopic">'+(saved.includes(id)?"Remove from saved":"＋ Save to my collection")+'</button></div></article>';
 const panel=$("#detailPanel");panel.classList.add("open");panel.scrollTop=0;
 const progress=$("#readerProgressBar");
 const updateProgress=()=>{const max=panel.scrollHeight-panel.clientHeight;const ratio=max>0?Math.min(1,Math.max(0,panel.scrollTop/max)):0;if(progress)progress.style.width=(ratio*100)+"%";};
 panel.onscroll=updateProgress;updateProgress();
 $("#saveTopic").onclick=()=>toggleSave(id);
 loadMedia(n,$("#detailImage")).then(media=>{
   const caption=$("#imageCaption");
   if(media?.image&&caption)caption.textContent="Image from the Wikipedia article · "+n.title;
   const extract=$("#wikiExtract"),text=$("#wikiExtractText");
   if(media?.extract&&media.extract.length>n.description.length+45&&extract&&text){
     text.textContent=media.extract;
     extract.hidden=false;
   }
 });
 document.querySelectorAll(".reader-related-item,.reader-next-card").forEach(el=>el.onclick=()=>openTopic(el.dataset.id));
 nextReads.forEach((x,i)=>loadMedia(x,$("#readerNextImage"+i)));
}

function closeDetail(){const panel=$("#detailPanel");panel.classList.remove("open");panel.scrollTop=0;const progress=$("#readerProgressBar");if(progress)progress.style.width="0%"}
function toggleSave(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem("tc-saved",JSON.stringify(saved));updateSavedCount();openTopic(id);toast(saved.includes(id)?"Saved to your collection":"Removed from your collection")}
function updateSavedCount(){$("#savedCount").textContent=saved.length}

function renderDailyFeatures(){
 if(!nodes.length)return;
 const now=new Date(),yearStart=new Date(now.getFullYear(),0,0);
 const day=Math.floor((now-new Date(yearStart.getFullYear(),yearStart.getMonth(),yearStart.getDate()))/86400000);
 const ordered=nodes.slice().sort((a,b)=>a.title.localeCompare(b.title));
 const daily=ordered[day%ordered.length];
 const validEdges=edges.filter(e=>nodes.some(n=>n.id===e.from)&&nodes.some(n=>n.id===e.to)&&e.label);
 const edge=validEdges.length?validEdges[day%validEdges.length]:null;
 const from=edge?nodes.find(n=>n.id===edge.from):daily;
 const to=edge?nodes.find(n=>n.id===edge.to):ordered[(day+1)%ordered.length];
 $("#dailyDate").textContent=now.toLocaleDateString("en",{day:"numeric",month:"long",year:"numeric"}).toUpperCase();
 $("#dailyTopicTitle").textContent=daily.title;
 $("#dailyTopicSummary").textContent=daily.short||daily.description;
 $("#dailyFromTitle").textContent=from.title;
 $("#dailyToTitle").textContent=to.title;
 $("#dailyRelationship").textContent=edge?edge.label:"Explore how these two subjects relate.";
 $("#dailyTopicCard").onclick=()=>openTopic(daily.id);
 $("#dailyFromButton").onclick=()=>openTopic(from.id);
 $("#dailyToButton").onclick=()=>openTopic(to.id);
 $("#dailyConnectionExplore").onclick=()=>openTopic(from.id);
 loadMedia(daily,$("#dailyTopicImage"));
 loadMedia(from,$("#dailyFromImage"));
 loadMedia(to,$("#dailyToImage"));
}

function renderFeatured(){const preferred=["bigbang","curie","liberation","bengal","sundarbans","smartphone","printingpress","quantum"];const featured=preferred.map(id=>nodes.find(n=>n.id===id)).filter(Boolean);$("#featuredTopics").innerHTML=featured.map((n,i)=>'<article class="story-card" data-id="'+esc(n.id)+'"><div class="story-image" id="storyImage'+i+'"></div><div class="story-meta"><span>'+esc(n.category)+'</span><span>'+esc(n.year||"")+'</span></div><h3>'+esc(n.title)+'</h3><p>'+esc(n.short||n.description)+'</p><span class="story-open">Explore this subject ↗</span></article>').join("");featured.forEach((n,i)=>{loadMedia(n,$("#storyImage"+i));document.querySelector('.story-card[data-id="'+n.id+'"]').onclick=()=>openTopic(n.id)})}

const journeys=[
{title:"From paper to the modern world",tag:"IDEAS · COMMUNICATION",intro:"How a practical writing surface helped ideas travel, challenged authority and reshaped knowledge.",steps:["paper","printing","renaissance","scientificmethod","newton"]},
{title:"The chain behind your smartphone",tag:"TECHNOLOGY · EVERYDAY LIFE",intro:"Follow the scientific discoveries and engineering breakthroughs behind the device in your pocket.",steps:["faraday","electricity","computer","transistor","semiconductor","smartphone"]},
{title:"From seeing microbes to treating infection",tag:"SCIENCE · MEDICINE",intro:"A story of instruments, evidence and medical breakthroughs that changed the treatment of disease.",steps:["microscope","germtheory","penicillin","worldwar2"]}
];
function renderJourneys(){
 const grid=$("#journeyGrid");
 grid.innerHTML=journeys.map((j,i)=>'<button class="journey-card" data-journey="'+i+'"><span class="journey-number">0'+(i+1)+'</span><span class="journey-tag">'+esc(j.tag)+'</span><strong>'+esc(j.title)+'</strong><span class="journey-intro">'+esc(j.intro)+'</span><span class="journey-cta">Explore this journey ↗</span></button>').join("");
 grid.querySelectorAll(".journey-card").forEach(btn=>btn.onclick=()=>showJourney(Number(btn.dataset.journey)));
}
function showJourney(index){
 const j=journeys[index],box=$("#journeyDetail");
 box.innerHTML='<div class="journey-detail-head"><div><p class="kicker">'+esc(j.tag)+'</p><h3>'+esc(j.title)+'</h3><p>'+esc(j.intro)+'</p></div><button class="journey-close" aria-label="Close journey">×</button></div><div class="journey-steps">'+j.steps.map((id,i)=>{const n=nodes.find(x=>x.id===id);return n?'<button class="journey-step" data-topic="'+esc(id)+'"><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+esc(n.title)+'</strong><small>'+esc(n.year||n.category)+'</small></button>':''}).join("")+'</div>';
 box.classList.add("visible");
 box.querySelector(".journey-close").onclick=()=>box.classList.remove("visible");
 box.querySelectorAll(".journey-step").forEach(btn=>btn.onclick=()=>openTopic(btn.dataset.topic));
 box.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function fillSelects(){const opts=nodes.slice().sort((a,b)=>a.title.localeCompare(b.title)).map(n=>'<option value="'+esc(n.id)+'">'+esc(n.title)+'</option>').join("");$("#fromTopic").innerHTML=opts;$("#toTopic").innerHTML=opts;$("#toTopic").selectedIndex=Math.min(12,nodes.length-1)}
function findPath(){const start=$("#fromTopic").value,end=$("#toTopic").value,box=$("#pathResult");if(start===end){box.textContent="Choose two different subjects.";return}const queue=[[start]],seen=new Set([start]);let found=null;while(queue.length){const path=queue.shift(),last=path[path.length-1];if(last===end){found=path;break}for(const e of edges){const next=e.from===last?e.to:e.to===last?e.from:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...path,next])}}}if(!found){box.textContent="No recorded route yet. Try another pair.";return}box.innerHTML="<strong>A route through the atlas</strong>"+found.map((id,i)=>{const n=nodes.find(x=>x.id===id),edge=i?edges.find(e=>(e.from===found[i-1]&&e.to===id)||(e.to===found[i-1]&&e.from===id)):null;return'<div class="path-step">'+(edge?'<small>'+esc(edge.label)+'</small>':"")+'<strong>'+esc(n.title)+'</strong></div>'}).join("");}
function renderTimeline(){
 const filters=$("#eraFilters");
 filters.innerHTML='<button class="history-filter active" data-era="all">All eras</button>'+historyData.eras.map(e=>'<button class="history-filter" data-era="'+esc(e.id)+'">'+esc(e.label)+'</button>').join("");
 filters.querySelectorAll("button").forEach(btn=>btn.onclick=()=>{activeEra=btn.dataset.era;filters.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===btn));renderTimelineItems()});
 renderTimelineItems();renderPeople();
}
function renderTimelineItems(){
 const events=historyData.events.filter(e=>activeEra==="all"||e.era===activeEra).slice().sort((a,b)=>a.sort-b.sort);
 $("#timelineList").innerHTML=events.map(e=>'<article class="history-event"><div class="history-event-date">'+esc(e.date)+'</div><div class="history-event-body"><p class="history-event-era">'+esc((historyData.eras.find(x=>x.id===e.era)||{}).label||"HISTORY")+'</p><h3>'+esc(e.title)+'</h3><p>'+esc(e.summary)+'</p><div class="history-event-links"><a href="'+esc(e.url)+'" target="_blank" rel="noopener noreferrer">'+esc(e.source)+' ↗</a>'+(nodes.some(n=>n.id===e.topicId)?'<button data-topic="'+esc(e.topicId)+'">Explore subject ↗</button>':'')+'</div></div></article>').join("");
 $("#timelineList").querySelectorAll("[data-topic]").forEach(btn=>btn.onclick=()=>openTopic(btn.dataset.topic));
}
function renderPeople(){
 const grid=$("#peopleGrid");if(!grid)return;
 grid.innerHTML=historyData.people.map((p,i)=>'<article class="history-person"><div class="history-person-image" id="personImage'+i+'"></div><div class="history-person-index">'+String(i+1).padStart(2,"0")+' / '+esc(p.life)+'</div><h3>'+esc(p.name)+'</h3><p class="history-person-role">'+esc(p.role)+'</p><p class="history-person-bio">'+esc(p.bio)+'</p><div class="history-person-footer"><a href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">'+esc(p.source)+' ↗</a>'+(nodes.some(n=>n.id===p.topicId)?'<button data-topic="'+esc(p.topicId)+'">Related subject</button>':'')+'</div></article>').join("");
 historyData.people.forEach((p,i)=>loadMedia({id:"person-"+i,title:p.name},$("#personImage"+i)));
 grid.querySelectorAll("[data-topic]").forEach(btn=>btn.onclick=()=>openTopic(btn.dataset.topic));
}
function search(q){const query=q.trim().toLowerCase();const results=nodes.filter(n=>(n.title+" "+n.description+" "+n.category+" "+n.type).toLowerCase().includes(query)).slice(0,15);$("#searchResults").innerHTML=results.length?results.map(n=>'<div class="search-result" data-id="'+esc(n.id)+'"><strong>'+esc(n.title)+'</strong><small>'+esc(n.category)+'</small></div>').join(""):'<p>No matching subject. Try a different word.</p>';document.querySelectorAll(".search-result").forEach(el=>el.onclick=()=>{closeSearch();openTopic(el.dataset.id)})}
function openSearch(){$("#searchOverlay").classList.add("open");$("#globalSearch").focus()}function closeSearch(){$("#searchOverlay").classList.remove("open")}
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
$("#searchOpen").onclick=openSearch;$("#searchClose").onclick=closeSearch;$("#searchOverlay").onclick=e=>{if(e.target===$("#searchOverlay"))closeSearch()};$("#globalSearch").oninput=e=>search(e.target.value);$("#collectionSearch").oninput=e=>{collectionQuery=e.target.value.toLowerCase().trim();renderCollectionSubjects(selectedCollection==="all"?nodes:nodes.filter(n=>n.category===selectedCollection))};document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();closeDetail()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}});
$("#closeDetail").onclick=closeDetail;$("#findPath").onclick=findPath;$("#randomBtn").onclick=()=>openTopic(nodes[Math.floor(Math.random()*nodes.length)].id);$("#closingRandom").onclick=()=>openTopic(nodes[Math.floor(Math.random()*nodes.length)].id);
$("#savedBtn").onclick=()=>{const list=nodes.filter(n=>saved.includes(n.id));if(!list.length){toast("Save a subject to start your collection.");return}$("#detailContent").innerHTML='<div class="detail-category">YOUR PERSONAL COLLECTION</div><h2>Saved subjects</h2>'+list.map(n=>'<div class="related-item" data-id="'+esc(n.id)+'"><strong>'+esc(n.title)+'</strong><small>'+esc(n.category)+'</small></div>').join("");$("#detailPanel").classList.add("open");document.querySelectorAll(".related-item").forEach(el=>el.onclick=()=>openTopic(el.dataset.id))};
loadData().catch(err=>{console.error(err);$("#collectionSubjects").innerHTML='<p class="collection-empty">The collection could not be loaded. Please refresh the page.</p>';toast("Could not load the atlas data.")});