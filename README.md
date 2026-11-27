# The Connection

**A visual atlas of human knowledge.** Explore how people, places, inventions, discoveries, events and ideas connect across time and disciplines.

## Current collection

- **101 subjects**
- **161 relationships**
- **6 collections:** Technology, Science, History, Geography, Culture and Humanity

The dataset includes global history and science alongside a deeper collection on Bengal and Bangladesh: the Pala period and Somapura Mahavihara, colonial land policy, the 1905 Partition and Swadeshi movement, Begum Rokeya, the Bengal famine, the University of Dhaka, the Six-Point Movement and the 1969 mass uprising.

## Experience

- Editorial, magazine-inspired interface with a warm paper palette and restrained typography
- Subject cards with photographs and artwork retrieved from Wikipedia's page-summary service when available
- Interactive relationship map powered by Cytoscape.js
- Search across titles, descriptions, categories and subject types
- Detailed subject panels with reference links and connected subjects
- Connection Finder that traces a route between two subjects
- Curated reading journeys that connect subjects into guided stories\n- Wikipedia article extracts surfaced in subject panels when available\n- Chronological timeline
- Personal saved collection stored in browser LocalStorage
- Responsive layout for desktop and mobile

## Sources and editorial approach

Subject summaries and relationships are curated, concise explanations. Wikipedia article links are included as starting points for further reading. Where available, the website retrieves a page thumbnail and short extract from Wikipedia's REST page-summary endpoint at runtime. Images and summaries remain subject to the source article's availability and licensing; consult the linked article and its image-credit information before reusing material elsewhere.

This is a growing, selective map, not a claim to represent every relationship or a complete account of any subject. Historical dates and interpretations can be debated, and the linked references should be checked for deeper research.

## Selected research references

- [Banglapedia: Partition of Bengal, 1905](https://en.banglapedia.org/index.php?title=Partition_of_Bengal%2C_1905)
- [Banglapedia: The Permanent Settlement](https://en.banglapedia.org/index.php?title=Permanent_Settlement%2C_The)
- [Banglapedia: Battle of Palashi](https://en.banglapedia.org/index.php?title=Palashi%2C_The_Battle_of)
- [Banglapedia: Bengal Famine, 1943](https://en.banglapedia.org/index.php?title=Famine%2C_1943)
- [University of Dhaka: Historical Outline](https://du.ac.bd/public/university/HistoricalOutline)
- [UNESCO: Somapura Mahavihara at Paharpur](https://whc.unesco.org/en/list/322)
- [NASA: Global Positioning System History](https://www.nasa.gov/general/global-positioning-system-history/)

These are selected editorial starting points. Individual subject descriptions remain concise introductions, not substitutes for specialist research.

## Run locally

Run the project through a local static server, such as VS Code Live Server. The site loads JSON files with `fetch`, so opening `index.html` directly as a file may prevent the data from loading.

## GitHub Pages

The repository is designed for GitHub Pages with the `main` branch and `/(root)` folder.

https://sarker908.github.io/the-connection/

## Technology

HTML, CSS, vanilla JavaScript, Cytoscape.js, JSON, Wikipedia REST page summaries and browser LocalStorage. No backend or paid API is required.
