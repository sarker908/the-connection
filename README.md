# The Connection

**A visual atlas of human knowledge.** Explore how people, places, inventions, discoveries, events and ideas connect across time and disciplines.

## Current collection

- **202 subjects** across **29 collections**
- **316 relationships** connecting subjects across disciplines
- **132 historical milestones**
- **81 biographical profiles**
- **317 source records** in the structured source register

The atlas includes global history, science, culture and technology alongside a deeper collection on Bengal and Bangladesh.

## Experience

- Editorial, magazine-inspired interface with a warm paper palette and restrained typography
- Subject reading panels with photographs, overviews, historical milestones, people, connected subjects and references
- A world-history timeline from early human societies to the present, with period filters and a dedicated Bengal and Bangladesh strand
- Biographical profiles for selected figures connected to the timeline
- A visual collection browser with 12 illustrated subject collections
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

`data/sources.json` is the central source-link registry. Each record has a stable ID, title, publisher, URL, role and the subject IDs it supports. Repeated URLs are stored once and linked to multiple relevant subjects where applicable. The registry currently contains 317 records: 255 encyclopedia entries, 14 academic or educational resources, and 48 institutional or official publications. Some records support timeline or biographical entries rather than a subject page, so their topic ID list is intentionally empty. These labels describe source type, not a quality score.

The registry is a provenance layer, not an automatic credibility score. A link being present does not mean every claim has been independently audited. Wikipedia is labelled as a general reference and discovery starting point. Subject-specific research should progressively add primary documents, peer-reviewed work and specialist institutional publications, especially for technical, disputed or sensitive claims. Historical and biographical links are retained as references to the corresponding archive entries.

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
