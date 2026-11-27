# The Connection

**A visual atlas of human knowledge.** Explore how people, places, inventions, discoveries, events and ideas connect across time and disciplines.

## Current collection

- **89 subjects**
- **130 relationships**
- **6 collections:** Technology, Science, History, Geography, Culture and Humanity

The dataset includes global history and science, alongside subjects from Bengal and Bangladesh, including the Bengali Language Movement, the Liberation War, Dhaka, the Sundarbans, the Bengal Renaissance and the Pala Empire.

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

## Run locally

Run the project through a local static server, such as VS Code Live Server. The site loads JSON files with `fetch`, so opening `index.html` directly as a file may prevent the data from loading.

## GitHub Pages

The repository is designed for GitHub Pages with the `main` branch and `/(root)` folder.

https://sarker908.github.io/the-connection/

## Technology

HTML, CSS, vanilla JavaScript, Cytoscape.js, JSON, Wikipedia REST page summaries and browser LocalStorage. No backend or paid API is required.
