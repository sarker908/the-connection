import fs from "node:fs";
import path from "node:path";

const readJson = (file) => JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
const nodes = readJson("data/nodes.json");
const connections = readJson("data/connections.json");
const sourcesData = readJson("data/sources.json");
const claimsData = readJson("data/claims.json");
const history = readJson("data/history.json");
const batches = [readJson("data/research-batches/batch-006.json"), readJson("data/research-batches/batch-007.json")];

const allNodes = [...nodes, ...batches.flatMap((batch) => batch.nodes || [])];
const allConnections = [...connections, ...batches.flatMap((batch) => batch.connections || [])];
const allSources = [...(sourcesData.sources || []), ...batches.flatMap((batch) => batch.sources || [])];
const allClaims = [...(claimsData.claims || []), ...batches.flatMap((batch) => batch.claims || [])];

const failures = [];
const duplicates = (items) => items.filter((value, index) => value && items.indexOf(value) !== index);
const nodeIds = allNodes.map((item) => item.id);
const sourceIds = allSources.map((item) => item.id);
const claimIds = allClaims.map((item) => item.id);
const nodeIdSet = new Set(nodeIds);
const sourceIdSet = new Set(sourceIds);

if (!Array.isArray(nodes)) failures.push("data/nodes.json must contain an array");
if (!Array.isArray(connections)) failures.push("data/connections.json must contain an array");
if (duplicates(nodeIds).length) failures.push(`Duplicate subject IDs: ${duplicates(nodeIds).slice(0, 8).join(", ")}`);
if (duplicates(sourceIds).length) failures.push(`Duplicate source IDs: ${duplicates(sourceIds).slice(0, 8).join(", ")}`);
if (duplicates(claimIds).length) failures.push(`Duplicate claim IDs: ${duplicates(claimIds).slice(0, 8).join(", ")}`);

const brokenConnections = allConnections.filter((edge) => !edge.from || !edge.to || !edge.label || !nodeIdSet.has(edge.from) || !nodeIdSet.has(edge.to));
if (brokenConnections.length) failures.push(`Broken or incomplete connection records: ${brokenConnections.length}; examples: ${JSON.stringify(brokenConnections.slice(0, 5))}`);

const brokenClaims = allClaims.filter((claim) => !claim.id || !claim.subjectId || !nodeIdSet.has(claim.subjectId) || !Array.isArray(claim.sourceIds) || claim.sourceIds.some((id) => !sourceIdSet.has(id)));
if (brokenClaims.length) failures.push(`Broken claim subject/source references: ${brokenClaims.length}; examples: ${JSON.stringify(brokenClaims.slice(0, 5))}`);

const badSources = allSources.filter((source) => !source.id || !source.title || !source.url || !/^https?:\/\//i.test(source.url));
if (badSources.length) failures.push(`Incomplete or invalid source records: ${badSources.length}`);

const sourceUrls = allSources.map((source) => source.url).filter(Boolean);
if (duplicates(sourceUrls).length) { const repeated = [...new Set(duplicates(sourceUrls))]; failures.push(`Duplicate source URLs: ${repeated.length}; records: ${JSON.stringify(allSources.filter((source) => repeated.includes(source.url)).map(({id,title,url}) => ({id,title,url})))}`); }

const badHistory = (history.events || []).filter((event) => !event.title || !event.date || typeof event.sort !== "number" || (event.url && !/^https?:\/\//i.test(event.url)));
if (badHistory.length) failures.push(`Incomplete or invalid historical events: ${badHistory.length}`);

const badPeople = (history.people || []).filter((person) => !person.name || (person.url && !/^https?:\/\//i.test(person.url)));
if (badPeople.length) failures.push(`Incomplete or invalid biography records: ${badPeople.length}`);

console.log("The Connection data validation");
console.log(JSON.stringify({
  subjects: allNodes.length,
  connections: allConnections.length,
  sources: allSources.length,
  claims: allClaims.length,
  historicalEvents: (history.events || []).length,
  biographies: (history.people || []).length,
  failures: failures.length
}, null, 2));

if (failures.length) {
  for (const failure of failures) console.error("FAIL:", failure);
  process.exitCode = 1;
} else {
  console.log("PASS: JSON and cross-reference checks completed.");
}
