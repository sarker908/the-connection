const $=s=>document.querySelector(s);
let nodes=[],edges=[],sourcesData={sources:[]},claimsData={claims:[]},selectedCollection="all",collectionQuery="",collectionExpanded=false,historyData={events:[],people:[],eras:[]},activeEra="all";
let saved=JSON.parse(localStorage.getItem("tc-saved")||"[]");
const colors={Technology:"#657d86",Science:"#a16b52",History:"#9a7851",Culture:"#75836b",Geography:"#64858a",Humanity:"#9a6d78",Mathematics:"#8575a6",Medicine:"#a66f78",Space:"#617c9c","Arts & Literature":"#a07855","Politics & Society":"#88745f",Environment:"#66836a"};
const mediaCache=new Map();
const mediaTargets=new WeakMap();
const mediaObserver=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;
 const el=entry.target,n=mediaTargets.get(el);
 mediaObserver.unobserve(el);
 if(n)getMedia(n).then(media=>{if(media?.image&&el.isConnected)paintImage(el,media.image)});
}),{rootMargin:"350px 0px"}):null;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function sourceTypeLabel(type){return ({encyclopedia:"ENCYCLOPEDIA",academic:"ACADEMIC / EDUCATIONAL",institutional:"INSTITUTIONAL / OFFICIAL"})[type]||"REFERENCE"}
function pageTitle(n){if(n.wiki){const p=n.wiki.split("/wiki/")[1];if(p)return decodeURIComponent(p.replace(/_/g," "))}return n.title}
async function getMedia(n){
 const key=n.id||n.title;
 if(mediaCache.has(key))return mediaCache.get(key);
 const task=(async()=>{
  const title=pageTitle(n);
  let summary=null;
  try{
   const summaryUrl="https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(title);
   const response=await fetch(summaryUrl);
   if(response.ok){
    summary=await response.json();
    const image=summary.thumbnail?.source||summary.originalimage?.source||null;
    if(image)return{image,extract:summary.extract||null,source:summary.content_urls?.desktop?.page||n.wiki||null};
   }
  }catch(error){}
  try{
   const searchUrl="https://en.wikipedia.org/w/rest.php/v1/search/page?q="+encodeURIComponent(title)+"&limit=5";
   const response=await fetch(searchUrl);
   if(response.ok){
    const data=await response.json();
    const pages=data.pages||[];
    const normalized=title.toLowerCase().replace(/[_-]/g," ").trim();
    const best=pages.find(page=>page.title?.toLowerCase()===normalized&&page.thumbnail?.url)||pages.find(page=>page.thumbnail?.url);
    if(best?.thumbnail?.url)return{image:best.thumbnail.url.startsWith("//")?"https:"+best.thumbnail.url:best.thumbnail.url,extract:summary?.extract||null,source:summary?.content_urls?.desktop?.page||"https://en.wikipedia.org/wiki/"+encodeURIComponent((best.key||best.title).replace(/ /g,"_"))};
   }
  }catch(error){}
  return summary?{image:null,extract:summary.extract||null,source:summary.content_urls?.desktop?.page||n.wiki||null}:null;
 })();
 mediaCache.set(key,task);
 return task;
}
function paintImage(el,url){if(url){el.style.backgroundImage="url('"+url.replace(/'/g,"%27")+"')";el.classList.add("has-image")}}
async function loadMedia(n,el){
 if(!el)return null;
 if(mediaObserver&&el.id!=="detailImage"){
  mediaTargets.set(el,n);
  mediaObserver.observe(el);
  return null;
 }
 const media=await getMedia(n);
 if(media?.image&&el.isConnected)paintImage(el,media.image);
 return media;
}
async function loadData(){const [nr,er,hr,sr,cr]=await Promise.all([fetch("data/nodes.json?v=14").then(r=>{if(!r.ok)throw Error("nodes");return r.json()}),fetch("data/connections.json?v=11").then(r=>{if(!r.ok)throw Error("connections");return r.json()}),fetch("data/history.json?v=1").then(r=>{if(!r.ok)throw Error("history");return r.json()}),fetch("data/sources.json?v=10").then(r=>{if(!r.ok)throw Error("sources");return r.json()}).catch(()=>({sources:[]})),fetch("data/claims.json?v=2").then(r=>{if(!r.ok)throw Error("claims");return r.json()}).catch(()=>({claims:[]}))]);nodes=nr;edges=er;historyData=hr;sourcesData=sr;claimsData=cr;$("#nodeStat").textContent=nodes.length;$("#edgeStat").textContent=edges.length;$("#domainStat").textContent=new Set(nodes.map(n=>n.category)).size.toString().padStart(2,"0");$("#atlasCount").textContent=nodes.length;renderCollectionBrowser();renderFeatured();renderDailyFeatures();renderOnThisDay();renderJourneys();fillSelects();renderTimeline();updateSavedCount();loadMedia(nodes.find(n=>n.id==="bigbang"),$("#heroImageMain"));loadMedia(nodes.find(n=>n.id==="bengal"),$("#heroImageSmall"))}
const collectionInfo={"Economics":["How money, markets and choices shape the way societies work.","economics"],"Engineering":["The structures, machines and systems people design to solve problems.","civilengineering"],"Food & Agriculture":["The crops, methods and discoveries behind how the world eats.","agriculture"],"Communication":["The technologies that carry ideas, voices and images across distance.","telegraph"],"Archaeology":["Objects, places and evidence that bring the human past into view.","archaeology"],"Education":["The institutions and ideas that help knowledge travel between generations.","university"],"Technology":["How tools, machines and networks reshape everyday life.","computer"],"Science":["The questions, experiments and discoveries that explain our universe.","einstein"],"History":["The turning points, empires and movements that made the present.","liberation"],"Geography":["Landscapes, places and natural systems that shape human life.","sundarbans"],"Culture":["Art, belief and shared ideas that travel across generations.","renaissance"],"Humanity":["The institutions and ideas through which societies organise themselves.","dhakauniversity"],"Mathematics":["The language of patterns, quantities and logical thinking.","algebra"],"Medicine":["Discoveries that changed how we understand and treat the human body.","penicillin"],"Space":["Our attempts to understand the cosmos and travel beyond Earth.","moon"],"Arts & Literature":["The creators and works that give shape to imagination.","leonardo"],"Politics & Society":["Power, citizenship and the systems that shape public life.","democracy"],"Environment":["The living planet, its changing climate and connected ecosystems.","climate"],"Psychology":["The mind, behaviour and the ways people understand one another.","psychology"],"Architecture":["Buildings, spaces and design movements that shape how we live.","architecture"],"Energy":["The forces and technologies that power societies.","energy"],"Linguistics":["How language works, changes and connects human communities.","linguistics"],"Film & Media":["Moving images, sound and the craft of visual storytelling.","cinema"],"Philosophy":["Questions about knowledge, reality, values and how to live.","ethics"],"Law & Rights":["The principles, institutions and declarations that shape justice and protect human dignity.","humanrights"],"Music":["Sound, instruments and musical traditions across cultures and time.","music"],"Anthropology":["Human origins, cultural life and the many ways societies develop.","humanorigins"],"Oceanography":["The oceans, their ecosystems and the forces that move the planet's waters.","oceancurrents"],"Astronomy":["The universe beyond Earth, from distant planets to extreme cosmic events.","blackhole"],"Number Theory":["Patterns, primes and structures hidden inside whole numbers.","atlas_number_theory_prime_numbers"],"Geometry":["Shapes, spaces and transformations used to describe the world.","atlas_geometry_euclidean_geometry"],"Statistics & Probability":["Methods for measuring evidence, uncertainty and data.","atlas_statistics_probability_probability"],"Mathematical Logic":["Formal systems for reasoning, proof and mathematical foundations.","atlas_mathematical_logic_propositional_logic"],"Quantum Physics":["The rules governing matter and energy at microscopic scales.","atlas_quantum_physics_quantum_mechanics"],"Particle Physics":["The fundamental particles and forces that make up the universe.","atlas_particle_physics_standard_model"],"Thermodynamics":["The laws of heat, work, energy and physical processes.","atlas_thermodynamics_entropy"],"Optics & Photonics":["The science and technology of light, lenses and photons.","atlas_optics_photonics_electromagnetism"],"Acoustics":["How sound is produced, travels and is perceived.","atlas_acoustics_sound_waves"],"Organic Chemistry":["The chemistry of carbon compounds and molecules of life.","atlas_organic_chemistry_hydrocarbons"],"Periodic Table & Elements":["The elements and patterns that organise ordinary matter.","atlas_periodic_table_elements_chemical_elements"],"Cell Biology":["The structures and processes that keep cells alive.","atlas_cell_biology_cell_membrane"],"Microbiology":["Microscopic organisms and their roles in health, ecosystems and industry.","atlas_microbiology_bacteria"],"Botany":["Plant diversity, structure, evolution and ecological relationships.","atlas_botany_plant_cells"],"Zoology":["Animal life, behaviour, diversity and evolution.","atlas_zoology_vertebrates"],"Ecology & Biodiversity":["Relationships between organisms, habitats and the living planet.","atlas_ecology_biodiversity_biodiversity"],"Marine Biology":["Life in the oceans, from microscopic plankton to whales.","atlas_marine_biology_plankton"],"Neuroscience":["The brain, nervous system and biological basis of behaviour.","atlas_neuroscience_neurons"],"Geology":["The materials, structure and long history of the solid Earth.","atlas_geology_minerals"],"Volcanology":["Magma, eruptions and volcanic landscapes.","atlas_volcanology_volcanic_eruptions"],"Earthquakes & Seismology":["The vibrations of Earth and the science used to understand them.","atlas_earthquakes_seismology_seismic_waves"],"Meteorology":["The atmosphere, weather systems and forecasting.","atlas_meteorology_earth_s_atmosphere"],"Hydrology":["The movement, storage and quality of water on Earth.","atlas_hydrology_the_water_cycle"],"Glaciology":["Ice sheets, glaciers and the frozen parts of Earth's climate system.","atlas_glaciology_glaciers"],"Anatomy & Physiology":["The structures of the human body and how they function.","atlas_anatomy_physiology_human_skeleton"],"Immunology":["How the body recognises threats and builds protection.","atlas_immunology_immune_system"],"Epidemiology":["Patterns, causes and prevention of health conditions in populations.","atlas_epidemiology_disease_transmission"],"Nutrition Science":["How food, nutrients and dietary patterns affect the body.","atlas_nutrition_science_macronutrients"],"Mental Health":["Psychological well-being, mental disorders and systems of support.","atlas_mental_health_stress"],"Surgery & Medical Innovation":["The history, methods and technologies of operative medicine.","atlas_surgery_medical_innovation_anesthesia"],"Algorithms & Data Structures":["Methods and structures used to solve computational problems.","atlas_algorithms_data_structures_sorting_algorithms"],"Programming Languages":["Formal languages used to express instructions for computers.","atlas_programming_languages_compiler"],"Cybersecurity":["Protecting systems, networks and information from digital threats.","atlas_cybersecurity_encryption"],"Databases & Information Systems":["How information is stored, queried, managed and connected.","atlas_databases_information_systems_relational_databases"],"Computer Networks":["Protocols and infrastructure that connect digital devices.","atlas_computer_networks_computer_network_routing"],"Robotics & Automation":["Machines that sense, decide and act in the physical world.","atlas_robotics_automation_industrial_robotics"],"Cryptography":["Mathematical techniques that secure information and digital trust.","atlas_cryptography_public_key_cryptography"],"Sociology":["How societies, institutions, groups and inequalities are organised.","atlas_sociology_social_stratification"],"Political Science":["Power, institutions, political ideas and the organisation of government.","atlas_political_science_constitutions"],"International Relations":["Diplomacy, conflict and cooperation across national borders.","atlas_international_relations_diplomacy"],"Demography & Population":["Population size, structure, distribution and change over time.","atlas_demography_population_population_growth"],"Education & Learning":["How people learn and how educational systems are designed.","atlas_education_learning_pedagogy"],"Cartography & GIS":["Maps, spatial data and technologies used to understand places.","atlas_cartography_gis_cartography"],"Urban Planning":["The design and management of cities, neighbourhoods and public spaces.","atlas_urban_planning_urban_design"],"Agronomy & Crop Science":["How crops are grown, improved and protected for food and fibre.","atlas_agronomy_crop_science_crop_rotation"],"Food Science":["The chemistry, safety, processing and sensory qualities of food.","atlas_food_science_food_fermentation"],"Forestry & Forest Management":["The ecology, conservation and sustainable use of forests.","atlas_forestry_forest_management_deforestation"],"Veterinary Science":["Animal health, disease prevention and the science of animal care.","atlas_veterinary_science_animal_diseases"],"Painting & Visual Arts":["Images, materials and artistic movements across cultures and time.","atlas_painting_visual_arts_oil_painting"],"Sculpture & Public Art":["Three-dimensional forms, monuments and art in shared spaces.","atlas_sculpture_public_art_sculpture"],"Photography":["The science and art of making images with light.","atlas_photography_camera_obscura"],"Theatre & Performance":["Live performance, dramatic storytelling and traditions of the stage.","atlas_theatre_performance_ancient_greek_theatre"],"Dance & Movement":["Human movement as art, ritual, communication and cultural expression.","atlas_dance_movement_ballet"],"Poetry & Literary Forms":["The forms, techniques and traditions of language as art.","atlas_poetry_literary_forms_lyric_poetry"],"Ancient Civilizations":["The cities, states and cultural systems of the ancient world.","atlas_ancient_civilizations_mesopotamia"],"Medieval Worlds":["Societies, trade, ideas and institutions between ancient and early modern eras.","atlas_medieval_worlds_byzantine_empire"],"Modern World History":["Revolutions, industrialisation and global transformations.","atlas_modern_world_history_industrial_revolution"],"Maritime History":["Ships, navigation and sea routes that connected societies.","atlas_maritime_history_age_of_sail"],"South Asian History":["The diverse societies, states and movements of the Indian subcontinent.","atlas_south_asian_history_maurya_empire"],"Bangladesh History":["The language, movements and events that shaped Bangladesh.","atlas_bangladesh_history_bengali_language_movement"]};
function renderCollectionBrowser(){const cats=[...new Set(nodes.map(n=>n.category))].sort((a,b)=>a.localeCompare(b));$("#collectionGrid").innerHTML=cats.map((cat,i)=>{const firstNode=nodes.find(n=>n.category===cat),info=collectionInfo[cat]||[firstNode?.collectionDescription||"Explore this field of knowledge.",firstNode?.id],count=nodes.filter(n=>n.category===cat).length;return '<button class="collection-tile" data-category="'+esc(cat)+'" aria-pressed="false"><span class="collection-tile-number">'+String(i+1).padStart(2,"0")+'</span><span class="collection-tile-image" id="collectionImage'+i+'"></span><span class="collection-tile-copy"><strong>'+esc(cat)+'</strong><small>'+count+' SUBJECTS</small><span class="collection-tile-description">'+esc(info[0])+'</span><span class="collection-tile-arrow">Explore collection ↗</span></span></button>'}).join("");cats.forEach((cat,i)=>{const id=(collectionInfo[cat]||[])[1],n=nodes.find(x=>x.id===id)||nodes.find(x=>x.category===cat);if(n)loadMedia(n,$("#collectionImage"+i))});$("#collectionGrid").querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>selectCollection(b.dataset.category,true));selectCollection("all")}
function selectCollection(cat,scrollToResults=false){selectedCollection=cat;$("#collectionGrid").querySelectorAll(".collection-tile").forEach(b=>{b.classList.toggle("active",b.dataset.category===cat);b.setAttribute("aria-pressed",String(b.dataset.category===cat))});const info=collectionInfo[cat],list=cat==="all"?nodes:nodes.filter(n=>n.category===cat);$("#collectionTitle").textContent=cat==="all"?"All subjects":cat;$("#collectionDescription").textContent=cat==="all"?"A little bit of everything, waiting to be explored.":(info?.[0]||"Explore this collection.");collectionQuery="";collectionExpanded=false;$("#collectionSearch").value="";renderCollectionSubjects(list);if(scrollToResults){const results=document.querySelector(".collection-results");if(results){window.setTimeout(()=>{const top=results.getBoundingClientRect().top+window.pageYOffset-92;window.scrollTo({top:Math.max(0,top),behavior:"smooth"});},120)}}}
function renderCollectionSubjects(list){const filtered=list.filter(n=>(n.title+" "+n.short+" "+n.description+" "+n.type).toLowerCase().includes(collectionQuery)).slice().sort((a,b)=>a.title.localeCompare(b.title));const expanded=collectionExpanded||!!collectionQuery;const shown=expanded?filtered:filtered.slice(0,12);$("#collectionSubjects").innerHTML=shown.map((n,i)=>'<button class="collection-subject" data-id="'+esc(n.id)+'"><span class="collection-subject-image" id="subjectImage'+i+'"></span><span class="collection-subject-meta">'+esc(n.category)+' · '+esc(n.year||n.type||"")+'</span><strong>'+esc(n.title)+'</strong><span class="collection-subject-summary">'+esc(n.short||n.description)+'</span><span class="collection-subject-link">Read the story ↗</span></button>').join("")||'<p class="collection-empty">No subjects match that search. Try another word.</p>';shown.forEach((n,i)=>loadMedia(n,$("#subjectImage"+i)));$("#collectionSubjects").querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>openTopic(b.dataset.id));$("#collectionMore").innerHTML=filtered.length>12?'<button class="collection-expand-button" type="button" aria-expanded="'+String(expanded)+'">'+(expanded?"Show less ↑":"Show all "+filtered.length+" subjects ↓")+"</button><span>"+(expanded?"Showing all "+filtered.length+" subjects":"Showing 12 of "+filtered.length+" subjects")+"</span>":'<span>'+filtered.length+" subjects in this view</span>";const toggle=$("#collectionMore .collection-expand-button");if(toggle)toggle.onclick=()=>{collectionExpanded=!collectionExpanded;renderCollectionSubjects(list)}}


function relatedTo(id){return edges.filter(e=>e.from===id||e.to===id).map(e=>({edge:e,node:nodes.find(n=>n.id===(e.from===id?e.to:e.from))})).filter(x=>x.node)}
async function openTopic(id){
 const n=nodes.find(x=>x.id===id);if(!n)return;
 const readMinutes=Math.max(1,Math.ceil(((n.description||"")+" "+(n.short||"")).trim().split(/\s+/).filter(Boolean).length/200));
 const linked=relatedTo(id),year=n.year||"Ongoing";
 const events=historyData.events.filter(e=>e.topicId===id);
 const people=historyData.people.filter(p=>p.topicId===id);
 const registeredSources=(sourcesData.sources||[]).filter(s=>Array.isArray(s.topicIds)&&s.topicIds.includes(id));
 const linkedClaims=(claimsData.claims||[]).filter(c=>c.subjectId===id);
 const fallbackSources=[];
 const addFallback=(label,url,kind)=>{if(url&&!fallbackSources.some(s=>s.url===url))fallbackSources.push({title:label,publisher:"",url,roles:[kind]})};
 addFallback("Wikipedia article",n.wiki,"General reference and further reading");
 events.forEach(e=>addFallback(e.source,e.url,"Historical reference"));
 people.forEach(p=>addFallback(p.source,p.url,"Biographical reference"));
 const sourceItems=(registeredSources.length?registeredSources:fallbackSources).map(s=>({label:s.title,url:s.url,kind:[s.publisher,...s.roles].filter(Boolean).join(" · "),sourceType:sourceTypeLabel(s.sourceClass)})).sort((a,b)=>({ "INSTITUTIONAL / OFFICIAL":0,"ACADEMIC / EDUCATIONAL":1,ENCYCLOPEDIA:2,REFERENCE:3 }[a.sourceType]??4)-({ "INSTITUTIONAL / OFFICIAL":0,"ACADEMIC / EDUCATIONAL":1,ENCYCLOPEDIA:2,REFERENCE:3 }[b.sourceType]??4));
 const claimEvidence=linkedClaims.length?'<section class="reader-section reader-evidence"><p class="reader-section-label">05 / RESEARCH TRACEABILITY</p><h3>What the references support</h3><p class="reader-section-intro">Concise research claims with links to the references recorded for this subject.</p><div class="reader-claim-list">'+linkedClaims.map(c=>{const cited=(c.sourceIds||[]).map(sourceId=>{const source=(sourcesData.sources||[]).find(s=>s.id===sourceId);return source?'<a href="'+esc(source.url)+'" target="_blank" rel="noopener noreferrer">'+esc(source.title)+'</a>':""}).filter(Boolean).join("");return '<article class="reader-claim"><p>'+esc(c.claim)+'</p><div class="reader-claim-citations">'+cited+'</div></article>'}).join("")+'</div><p class="reader-note">Research claims are pending independent editorial review. References support traceability and further reading, not a guarantee that every sentence has been independently verified.</p></section>':"";
 const archiveCount=events.length+people.length;
 const nextReads=linked.slice().sort((a,b)=>{
   const aDifferent=a.node.category!==n.category?1:0,bDifferent=b.node.category!==n.category?1:0;
   return bDifferent-aDifferent;
 }).slice(0,3);
 $("#detailContent").innerHTML=
 '<article class="reader">'+
 '<div class="reader-image-wrap"><div class="detail-image reader-image" id="detailImage"></div><span class="reader-image-caption" id="imageCaption">A visual reference for this subject</span></div>'+
 '<div class="reader-body">'+
 '<div class="reader-eyebrow"><span>'+esc(n.category.toUpperCase())+'</span><span>FIELD NOTES · '+esc((n.type||"SUBJECT").toUpperCase())+'</span><span> '+readMinutes+' MIN READ</span><span class="reader-review-status">'+(n.contentStatus==="starter"?"STARTER CONTENT · RESEARCH NEEDED":n.contentStatus==="research-enriched"?"RESEARCH ENRICHED · EXPERT REVIEW PENDING":"EDITORIAL REVIEW PENDING")+'</span></div>'+
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
 claimEvidence + '<section class="reader-sources"><p class="reader-section-label">SOURCES & FURTHER READING</p>'+
 (sourceItems.length?'<div class="reader-source-list">'+sourceItems.map(s=>'<a class="reader-source-link" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer"><span><strong>'+esc(s.label)+'</strong><small>'+esc(s.kind)+' · '+esc(s.sourceType)+'</small></span><span>↗</span></a>').join("")+'</div>':'<p class="reader-note">No external reference has been added for this subject yet.</p>')+
 '<p class="reader-note">Source labels describe the kind of publisher or resource, not a credibility score. A listed link is not proof that every sentence has been independently verified. Compare independent references, and prefer primary documents, peer-reviewed research and specialist institutional publications for detailed or disputed questions. Wikipedia is included as a general reference and discovery starting point. Dates marked c. are approximate.</p></section>'+
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

async function renderOnThisDay(){
 const host=$("#onThisDayGrid"),dateLabel=$("#onThisDayDate"),status=$("#onThisDayStatus");
 if(!host)return;
 const now=new Date(),month=String(now.getMonth()+1).padStart(2,"0"),day=String(now.getDate()).padStart(2,"0");
 dateLabel.textContent=now.toLocaleDateString("en",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
 status.textContent="GATHERING STORIES FROM THIS DATE";
 host.innerHTML='<p class="on-this-day-loading">Looking through the historical record…</p>';
 try{
  const response=await fetch("https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/"+month+"/"+day,{headers:{"Accept":"application/json"}});
  if(!response.ok)throw new Error("The history feed is temporarily unavailable.");
  const payload=await response.json();
  const events=(payload.events||[]).filter(e=>e.text&&e.year).sort((a,b)=>b.year-a.year);
  if(!events.length)throw new Error("No entries were returned for this date.");
  const chosen=events.slice(0,8);
  host.innerHTML=chosen.map((event,i)=>{
   const page=(event.pages||[]).find(p=>p.thumbnail||p.title)||(event.pages||[])[0];
   const image=page?.thumbnail?.source||"";
   const title=page?.titles?.normalized||page?.title?.replace(/_/g," ")||"Read the event";
   const href=page?.content_urls?.desktop?.page||"https://en.wikipedia.org/wiki/"+encodeURIComponent((page?.title||"").replace(/ /g,"_"));
   return '<article class="on-this-day-card"><a class="on-this-day-image" id="onThisDayImage'+i+'" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer" aria-label="Read about '+esc(title)+'" '+(image?'style="background-image:url(\''+esc(image)+'\');"':'')+'><span>'+String(event.year)+'</span></a><div class="on-this-day-copy"><small>'+String(i+1).padStart(2,"0")+' / HISTORICAL MOMENT</small><h3>'+esc(event.text)+'</h3><a href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">Explore the story ↗</a></div></article>';
  }).join("");
  chosen.forEach((event,i)=>{
   const page=(event.pages||[]).find(p=>p.thumbnail||p.title)||(event.pages||[])[0];
   const href=page?.content_urls?.desktop?.page||"https://en.wikipedia.org/wiki/"+encodeURIComponent((page?.title||"").replace(/ /g,"_"));
   const image=page?.thumbnail?.source;
   if(!image)loadMedia({id:"on-this-day-"+month+"-"+day+"-"+i,title:page?.title?.replace(/_/g," ")||event.text,wiki:href},$("#onThisDayImage"+i));
  });
  status.textContent=events.length+" MOMENTS RECORDED ON THIS DATE · WIKIPEDIA";
 }catch(error){
  host.innerHTML='<p class="on-this-day-empty">The live history feed could not be reached just now. Try again later, or explore the full historical archive below.</p>';
  status.textContent="HISTORICAL FEED TEMPORARILY UNAVAILABLE";
 }
}

function renderFeatured(){const preferred=["bigbang","curie","liberation","bengal","sundarbans","smartphone","printingpress","quantum"];const featured=preferred.map(id=>nodes.find(n=>n.id===id)).filter(Boolean);$("#featuredTopics").innerHTML=featured.map((n,i)=>'<article class="story-card" data-id="'+esc(n.id)+'"><div class="story-image" id="storyImage'+i+'"></div><div class="story-meta"><span>'+esc(n.category)+'</span><span>'+esc(n.year||"")+'</span></div><h3>'+esc(n.title)+'</h3><p>'+esc(n.short||n.description)+'</p><span class="story-open">Explore this subject ↗</span></article>').join("");featured.forEach((n,i)=>{loadMedia(n,$("#storyImage"+i));document.querySelector('.story-card[data-id="'+n.id+'"]').onclick=()=>openTopic(n.id)})}

const journeys=[{"title":"From paper to the modern world","tag":"IDEAS · COMMUNICATION","intro":"How a practical writing surface helped ideas travel, challenged authority and reshaped knowledge.","steps":["paper","printing","renaissance","scientificmethod","newton"]},{"title":"The chain behind your smartphone","tag":"TECHNOLOGY · EVERYDAY LIFE","intro":"Follow the scientific discoveries and engineering breakthroughs behind the device in your pocket.","steps":["faraday","electricity","computer","transistor","semiconductor","smartphone"]},{"title":"From seeing microbes to treating infection","tag":"SCIENCE · MEDICINE","intro":"A story of instruments, evidence and medical breakthroughs that changed the treatment of disease.","steps":["microscope","germtheory","vaccines","penicillin"]},{"title":"How humans learned to navigate","tag":"EXPLORATION · GEOGRAPHY","intro":"From simple instruments to satellites, trace the tools that helped people find their way across the planet.","steps":["compass","navigation","satellite","internet"]},{"title":"Our changing picture of the universe","tag":"SPACE · DISCOVERY","intro":"Follow the observations and ideas that transformed our understanding of the cosmos.","steps":["telescope","galileo","hubble","bigbang","exoplanet"]},{"title":"The long road to modern computing","tag":"MATHEMATICS · TECHNOLOGY","intro":"See how number systems, logic and machines became the foundations of the digital world.","steps":["zero","algebra","binary","algorithm","computer","ai"]}];
let journeyProgress=(()=>{try{return JSON.parse(localStorage.getItem("tc-journey-progress")||"{}")}catch(e){return {}}})();

function journeyDone(index){return Array.isArray(journeyProgress[index])?journeyProgress[index]:[]}
function journeyPercent(index){const j=journeys[index],done=journeyDone(index);return Math.round(done.filter(id=>j.steps.includes(id)).length/j.steps.length*100)}
function saveJourneyProgress(){localStorage.setItem("tc-journey-progress",JSON.stringify(journeyProgress))}
function renderJourneys(){
 const grid=$("#journeyGrid");
 grid.innerHTML=journeys.map((j,i)=>{const done=journeyPercent(i),first=nodes.find(n=>n.id===j.steps[0]);return '<button class="journey-card" data-journey="'+i+'" type="button"><span class="journey-card-image" id="journeyCover'+i+'"></span><span class="journey-card-body"><span class="journey-card-top"><span class="journey-number">0'+(i+1)+'</span><span class="journey-tag">'+esc(j.tag)+'</span></span><strong>'+esc(j.title)+'</strong><span class="journey-intro">'+esc(j.intro)+'</span><span class="journey-card-progress"><span><i style="width:'+done+'%"></i></span><small>'+done+'% complete</small></span><span class="journey-cta">'+(done?'Continue journey':'Begin the journey')+' ↗</span></span></button>'}).join("");
 grid.querySelectorAll(".journey-card").forEach(btn=>btn.onclick=()=>showJourney(Number(btn.dataset.journey)));
 journeys.forEach((j,i)=>loadMedia(nodes.find(n=>n.id===j.steps[0]),$("#journeyCover"+i)));
}
function showJourney(index){
 const j=journeys[index],box=$("#journeyDetail"),done=journeyDone(index).filter(id=>j.steps.includes(id)),percent=journeyPercent(index);
 const current=j.steps.find(id=>!done.includes(id));
 const currentIndex=current?j.steps.indexOf(current):j.steps.length-1;
 const steps=j.steps.map((id,i)=>{const n=nodes.find(x=>x.id===id);if(!n)return "";const isDone=done.includes(id),isCurrent=id===current;return '<article class="journey-step-row '+(isDone?'is-done':'')+(isCurrent?' is-current':'')+'"><span class="journey-step-index">'+String(i+1).padStart(2,"0")+'</span><div class="journey-step-copy"><span class="journey-step-status">'+(isDone?'COMPLETED':isCurrent?'UP NEXT':'ON THE WAY')+'</span><strong>'+esc(n.title)+'</strong><small>'+esc(n.year||n.category)+'</small><p>'+esc(n.short||n.description)+'</p></div><div class="journey-step-actions"><button class="journey-open-topic" data-topic="'+esc(id)+'" type="button">Read subject ↗</button><button class="journey-mark-step" data-step="'+esc(id)+'" type="button">'+(isDone?'Mark again':'Mark complete ✓')+'</button></div></article>'}).join("");
 box.innerHTML='<div class="journey-detail-head"><div><p class="kicker">'+esc(j.tag)+'</p><h3>'+esc(j.title)+'</h3><p>'+esc(j.intro)+'</p></div><button class="journey-close" aria-label="Close journey">×</button></div><div class="journey-progress-summary"><div><strong>'+percent+'%</strong><span>'+done.length+' OF '+j.steps.length+' SUBJECTS COMPLETED</span></div><span class="journey-progress-track"><i style="width:'+percent+'%"></i></span></div><div class="journey-detail-actions"><button class="journey-resume" type="button">'+(percent===100?'Read this journey again':done.length?'Continue from step '+(currentIndex+1):'Start this journey')+' ↗</button>'+(done.length?'<button class="journey-reset" type="button">Reset progress</button>':'')+'</div><div class="journey-step-list">'+steps+'</div>'+(percent===100?'<p class="journey-finish-note">You have completed this reading path. Nice work. Follow another thread to keep exploring.</p>':'');
 box.classList.add("visible");
 box.querySelector(".journey-close").onclick=()=>box.classList.remove("visible");
 box.querySelector(".journey-resume").onclick=()=>{const target=box.querySelector('.journey-step-row[data-step="'+(current||j.steps[0])+'"]')||box.querySelector(".journey-step-row");if(target)target.scrollIntoView({behavior:"smooth",block:"center"})};
 box.querySelectorAll(".journey-step-row").forEach(row=>{const id=row.querySelector("[data-topic]").dataset.topic;row.dataset.step=id});
 box.querySelectorAll(".journey-open-topic").forEach(btn=>btn.onclick=()=>openTopic(btn.dataset.topic));
 box.querySelectorAll(".journey-mark-step").forEach(btn=>btn.onclick=()=>{const id=btn.dataset.step,arr=journeyDone(index);journeyProgress[index]=arr.includes(id)?arr.filter(x=>x!==id):[...arr,id];saveJourneyProgress();showJourney(index);renderJourneys()});
 const reset=box.querySelector(".journey-reset");if(reset)reset.onclick=()=>{delete journeyProgress[index];saveJourneyProgress();showJourney(index);renderJourneys()};
 box.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function fillSelects(){const opts=nodes.slice().sort((a,b)=>a.title.localeCompare(b.title)).map(n=>'<option value="'+esc(n.id)+'">'+esc(n.title)+'</option>').join("");$("#fromTopic").innerHTML=opts;$("#toTopic").innerHTML=opts;$("#toTopic").selectedIndex=Math.min(12,nodes.length-1)}
function findPath(){const start=$("#fromTopic").value,end=$("#toTopic").value,box=$("#pathResult");if(start===end){box.textContent="Choose two different subjects.";return}const queue=[[start]],seen=new Set([start]);let found=null;while(queue.length){const path=queue.shift(),last=path[path.length-1];if(last===end){found=path;break}for(const e of edges){const next=e.from===last?e.to:e.to===last?e.from:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...path,next])}}}if(!found){box.textContent="No recorded route yet. Try another pair.";return}box.innerHTML="<strong>A route through the atlas</strong>"+found.map((id,i)=>{const n=nodes.find(x=>x.id===id),edge=i?edges.find(e=>(e.from===found[i-1]&&e.to===id)||(e.to===found[i-1]&&e.from===id)):null;return'<div class="path-step">'+(edge?'<small>'+esc(edge.label)+'</small>':"")+'<strong>'+esc(n.title)+'</strong></div>'}).join("");}
function renderTimeline(){
 const eraSelect=$("#historyEraSelect"),regionSelect=$("#historyRegionSelect");
 eraSelect.innerHTML='<option value="all">All periods</option>'+historyData.eras.map(e=>'<option value="'+esc(e.id)+'">'+esc(e.label)+' · '+esc(e.range)+'</option>').join("");
 const regions=[...new Set(historyData.events.map(e=>e.region||"Global"))].sort((a,b)=>a.localeCompare(b));
 regionSelect.innerHTML='<option value="all">All regions</option>'+regions.map(r=>'<option value="'+esc(r)+'">'+esc(r)+'</option>').join("");
 eraSelect.onchange=renderTimelineItems;regionSelect.onchange=renderTimelineItems;
 renderTimelineItems();renderPeople();
}
function renderTimelineItems(){
 const era=$("#historyEraSelect").value,region=$("#historyRegionSelect").value;
 const events=historyData.events.filter(e=>(era==="all"||e.era===era)&&(region==="all"||(e.region||"Global")===region)).slice().sort((a,b)=>a.sort-b.sort);
 $("#historyResultCount").textContent=events.length+" historical entries";
 $("#timelineList").innerHTML=events.map((e,i)=>'<article class="history-event"><div class="history-event-visual"><div class="history-event-image" id="historyEventImage'+i+'"></div><div class="history-event-date">'+esc(e.date)+'<small>'+esc(e.region||"Global")+'</small></div></div><div class="history-event-body"><p class="history-event-era">'+esc((historyData.eras.find(x=>x.id===e.era)||{}).label||"HISTORY")+'</p><h3>'+esc(e.title)+'</h3><p>'+esc(e.summary)+'</p><div class="history-event-links"><a href="'+esc(e.url)+'" target="_blank" rel="noopener noreferrer">'+esc(e.source)+' ↗</a>'+(nodes.some(n=>n.id===e.topicId)?'<button data-topic="'+esc(e.topicId)+'">Explore subject ↗</button>':'')+'</div></div></article>').join("")||'<p class="history-empty">No entries in this selection yet. Try another period or region.</p>';
 events.forEach((e,i)=>loadMedia({id:"history-"+e.sort+"-"+i,title:e.title,wiki:/wikipedia\.org\/wiki\//i.test(e.url)?e.url:null},$("#historyEventImage"+i)));
 $("#timelineList").querySelectorAll("[data-topic]").forEach(btn=>btn.onclick=()=>openTopic(btn.dataset.topic));
}
function renderPeople(){
 const grid=$("#peopleGrid");if(!grid)return;
 const regionSelect=$("#peopleRegionSelect");
 if(regionSelect){
  const regions=[...new Set(historyData.people.map(p=>p.region||"Global"))].sort((a,b)=>a.localeCompare(b));
  const current=regionSelect.value||"all";
  regionSelect.innerHTML='<option value="all">All regions</option>'+regions.map(r=>'<option value="'+esc(r)+'">'+esc(r)+'</option>').join("");
  regionSelect.value=regions.includes(current)?current:"all";
  regionSelect.onchange=renderPeople;
 }
 const selected=regionSelect?regionSelect.value:"all";
 const people=historyData.people.filter(p=>selected==="all"||(p.region||"Global")===selected);
 grid.innerHTML=people.map((p,i)=>'<article class="history-person"><div class="history-person-image" id="personImage'+i+'"></div><div class="history-person-index">'+esc(p.region||"Global")+' · '+String(i+1).padStart(2,"0")+' / '+esc(p.life)+'</div><h3>'+esc(p.name)+'</h3><p class="history-person-role">'+esc(p.role)+'</p><p class="history-person-bio">'+esc(p.bio)+'</p><div class="history-person-footer"><a href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">'+esc(p.source)+' ↗</a>'+(nodes.some(n=>n.id===p.topicId)?'<button data-topic="'+esc(p.topicId)+'">Related subject</button>':'')+'</div></article>').join("")||'<p class="history-empty">No profiles in this region yet.</p>';
 $("#peopleCount").textContent=people.length+" people";
 people.forEach((p,i)=>loadMedia({id:"person-"+p.name.toLowerCase().replace(/[^a-z0-9]+/g,"-"),title:p.name,wiki:/wikipedia\.org\/wiki\//i.test(p.url)?p.url:null},$("#personImage"+i)));
 grid.querySelectorAll("[data-topic]").forEach(btn=>btn.onclick=()=>openTopic(btn.dataset.topic));
}
function search(q){const query=q.trim().toLowerCase();const results=nodes.filter(n=>(n.title+" "+n.description+" "+n.category+" "+n.type).toLowerCase().includes(query)).slice(0,15);$("#searchResults").innerHTML=results.length?results.map(n=>'<div class="search-result" data-id="'+esc(n.id)+'"><strong>'+esc(n.title)+'</strong><small>'+esc(n.category)+'</small></div>').join(""):'<p>No matching subject. Try a different word.</p>';document.querySelectorAll(".search-result").forEach(el=>el.onclick=()=>{closeSearch();openTopic(el.dataset.id)})}
function openSearch(){$("#searchOverlay").classList.add("open");$("#globalSearch").focus()}function closeSearch(){$("#searchOverlay").classList.remove("open")}
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
$("#searchOpen").onclick=openSearch;$("#searchClose").onclick=closeSearch;$("#searchOverlay").onclick=e=>{if(e.target===$("#searchOverlay"))closeSearch()};$("#globalSearch").oninput=e=>search(e.target.value);$("#collectionSearch").oninput=e=>{collectionQuery=e.target.value.toLowerCase().trim();renderCollectionSubjects(selectedCollection==="all"?nodes:nodes.filter(n=>n.category===selectedCollection))};document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();closeDetail()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}});
$("#closeDetail").onclick=closeDetail;$("#findPath").onclick=findPath;$("#randomBtn").onclick=()=>openTopic(nodes[Math.floor(Math.random()*nodes.length)].id);$("#closingRandom").onclick=()=>openTopic(nodes[Math.floor(Math.random()*nodes.length)].id);
$("#savedBtn").onclick=()=>{const list=nodes.filter(n=>saved.includes(n.id));if(!list.length){toast("Save a subject to start your collection.");return}$("#detailContent").innerHTML='<div class="detail-category">YOUR PERSONAL COLLECTION</div><h2>Saved subjects</h2>'+list.map(n=>'<div class="related-item" data-id="'+esc(n.id)+'"><strong>'+esc(n.title)+'</strong><small>'+esc(n.category)+'</small></div>').join("");$("#detailPanel").classList.add("open");document.querySelectorAll(".related-item").forEach(el=>el.onclick=()=>openTopic(el.dataset.id))};
loadData().catch(err=>{console.error(err);$("#collectionSubjects").innerHTML='<p class="collection-empty">The collection could not be loaded. Please refresh the page.</p>';toast("Could not load the atlas data.")});