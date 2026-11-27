# The Connection

**A visual atlas of human knowledge.** Explore how people, places, inventions, discoveries, events and ideas connect across time and disciplines.

## Current collection

- **2280 subjects** across **500 collections**
- **1663 relationships** connecting subjects across disciplines
- **132 historical milestones**
- **81 biographical profiles**
- **1386 unique source records** in the structured source register

The atlas includes global history, science, culture and technology alongside a deeper collection on Bengal and Bangladesh.

## Experience

- Editorial, magazine-inspired interface with a warm paper palette and restrained typography
- Subject reading panels with photographs, overviews, historical milestones, people, connected subjects and references
- A world-history timeline from early human societies to the present, with period filters and a dedicated Bengal and Bangladesh strand
- Biographical profiles for selected figures connected to the timeline
- A visual collection browser with 500 subject collections
- Search across titles, descriptions, categories and subject types
- Connection Finder that traces a route between two subjects
- Curated reading journeys that connect subjects into guided stories
- Wikipedia article extracts surfaced in subject panels when available
- A structured source register linking subjects to general references, historical references and biographical references
- Publisher, source-type and source-role labels shown in subject readers, with a clear note distinguishing linked references from independently verified claims
- Personal saved collection stored in browser LocalStorage
- Responsive layout for desktop and mobile

## Sources and editorial approach

The historical chronology and biographies in `data/history.json` are editorial paraphrases based on linked references. World-history entries draw on OpenStax World History, the Council on Foreign Relations, UNESCO, the United Nations, NASA, national archives and other institutional publications. Bengal and Bangladesh entries draw on Banglapedia, UNESCO, the University of Dhaka and institutional historical publications. Wikipedia is used as a discovery and further-reading source where appropriate, not as the sole authority for the curated chronology.

Approximate dates are marked with `c.` or a period range. Some dates and periodisations differ across historians; where the evidence does not support a precise date, the interface preserves an approximate range rather than implying false certainty. Every historical event and biographical profile links to its reference.

Where available, the website retrieves a page thumbnail and short extract from Wikipedia's REST page-summary endpoint at runtime. Images and summaries remain subject to the source article's availability and licensing; consult the linked article and its image-credit information before reusing material elsewhere.

This is a growing, selective collection, not a claim to represent every relationship or a complete account of any subject. The summaries are introductions, not substitutes for specialist research.

## Source register and verification

`data/sources.json` is the central source-link registry. Each record has a stable ID, title, publisher, URL, role and the subject IDs it supports. Repeated URLs are consolidated into one record with merged subject IDs and source roles. The registry contains 1386 unique URL records. Source classes describe the type of source, not a quality score. Some references support timeline or biographical entries rather than a subject page, so their topic ID list is intentionally empty. Source classes describe the type of source, not a quality score. 

The registry is a provenance layer, not an automatic credibility score. A link being present does not mean every claim has been independently audited. Wikipedia is labelled as a general reference and discovery starting point. Subject-specific research should progressively add primary documents, peer-reviewed work and specialist institutional publications, especially for technical, disputed or sensitive claims. Historical and biographical links are retained as references to the corresponding archive entries.

## Research-enriched subjects

Five focused research batches have enriched foundational subjects and selected entries across global history, public health, climate, engineering, philosophy, literature, culture, politics, economics and South Asian history. Batch 004 added 25 subjects and 50 claims; Batch 005 adds a further 25 existing subjects, 50 claim-level records and 21 new subject-specific references. All remain marked `research-enriched` and `editorial-review-pending` until a separate independent editorial review is documented.

## Knowledge quality standard

Every subject now carries an explicit editorial status. `starter` identifies a template-based introductory entry that needs substantive research. `review-pending` means the entry has not passed a documented editorial review. Neither status implies verification. Source links are tracked separately from claim-level verification.

The next content workflow is to research a subject, write an original concise explanation, attach at least two independent high-quality references where practical, record dates and uncertainty, and review its cross-disciplinary relationships. Primary sources are preferred for historical claims; peer-reviewed literature and specialist institutions are preferred for scientific and technical claims. Sources must support the specific subject, not merely its broad discipline.

The reusable editorial rules and required subject fields are documented in `data/editorial-standard.json`.

## Selected research references

- [Banglapedia: Pala Rule](https://en.banglapedia.org/index.php?title=Pala_Rule)
- [Banglapedia: Somapura Mahavihara](https://en.banglapedia.org/index.php/Somapura_Mahavihara)
- [UNESCO: Somapura Mahavihara at Paharpur](https://whc.unesco.org/en/list/322)
- [Banglapedia: Battle of Palashi](https://en.banglapedia.org/index.php?title=Palashi%2C_The_Battle_of)
- [Banglapedia: The Permanent Settlement](https://en.banglapedia.org/index.php?title=Permanent_Settlement%2C_The)
- [Banglapedia: Partition of Bengal, 1905](https://en.banglapedia.org/index.php?title=Partition_of_Bengal%2C_1905)
- [Banglapedia: Annulment of Bengal Partition](https://en.banglapedia.org/index.php?title=Annulment_of_Bengal_Partition)
- [Banglapedia: Language Movement](https://en.banglapedia.org/index.php/Language_Movement)
- [Banglapedia: Sheikh Mujibur Rahman](https://en.banglapedia.org/index.php?title=Rahman%2C_Bangabandhu_Sheikh_Mujibur)
- [University of Dhaka: Historical Outline](https://www.du.ac.bd/index.php/university/HistoricalOutline)
- [Banglapedia: Bengal Famine, 1943](https://en.banglapedia.org/index.php?title=Famine%2C_1943)

## Run locally

Run the project through a local static server, such as VS Code Live Server. The site loads JSON files with `fetch`, so opening `index.html` directly as a file may prevent the data from loading.

## GitHub Pages

The repository is designed for GitHub Pages with the `main` branch and `/(root)` folder.

https://sarker908.github.io/the-connection/

## Technology

HTML, CSS, vanilla JavaScript, JSON, Wikipedia REST page summaries and browser LocalStorage. No backend or paid API is required.


## Research Batch 004: Philosophy, Literature, Politics, Economics and Scientific Ideas

**Completed:** 28 November 2026  
**Subjects enriched:** 25 existing subjects  
**New claim-level records:** 50  **New specialist source records:** 19

This batch deepens 25 subjects with existing cross-disciplinary relationships. It covers globalization and economics; writing, music and literature; democracy, human rights and the rule of law; the Bengal Renaissance, Buddhism and the Reformation; and scientific figures and concepts including Darwin, Leonardo da Vinci, Marie Curie and radioactivity. Each entry has been rewritten in original language and linked to two distinct references through claim-level provenance. Existing subject IDs, collections and connections were preserved.

**Editorial status:** research-enriched, not expert-reviewed. Claim references support traceability and further reading; they do not certify every sentence as independently verified. Historical interpretation, specialist context and source quality still require a separate editorial review.

**Structural audit:** 2280 subjects, 1663 relationships, 1386 source records and 236 claim records. All relationship endpoints, claim subject IDs and claim source IDs resolve. Every Batch 004 and Batch 005 subject has at least one existing relationship and two distinct references.


## Research Batch 005: Global History, Bengal and Cultural Exchange

**Completed:** 28 November 2026  
**Subjects enriched:** 25 existing subjects  
**New claim-level records:** 50  
**New specialist source records:** 21

This batch strengthens 25 existing subjects spanning World War II, Ancient Greece, the Black Death, the Indus and Mughal civilisations, Bengal's political history, the 1971 Liberation War, the Bengal famine, Bengali writers and reformers, the South Asian monsoon, the Bengal Delta, Dhaka, Somapura Mahavihara, silk networks, jazz and Bengal muslin. Two claim-level statements per subject are linked to distinct references. Existing subject IDs, collections and relationships were preserved.

**Editorial status:** research-enriched, not expert-reviewed. Historical interpretation, contested casualty estimates, colonial policy and political narratives require independent review. References provide traceability and further reading; they do not certify every sentence.


## Research batch 006: global civilisations and knowledge traditions

Batch 006 adds 26 atlas subjects across African kingdoms and cities, Chinese and Japanese history, Persian and Arab empires, Indigenous American civilisations, and the history of mathematics and literature. It contributes 52 claim records, 32 source records, and 30 connections. The new records are stored additively in `data/research-batches/batch-006.json`; the application merges this batch at load time without rewriting the large core subject, connection, source or claim files. All claims remain marked `editorial-review-pending` until separate independent editorial review. The source registry provides traceability and further reading, not a guarantee that each claim has been independently verified.


## Stage 007: richer subject reading

The subject reader now includes an in-panel search for direct relationships. Visitors can filter a subject's recorded connections by title, collection or relationship description without leaving the article. The visible connection count updates as the list is filtered. This is a browsing improvement only; it does not create or infer new relationships.


## Stage 008: searchable historical timeline

The history archive now supports keyword search across event titles, summaries, dates, regions and source labels, alongside the existing period and region filters. Filters work together and update the result count and timeline in place.
