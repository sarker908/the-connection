# The Connection

**An interactive knowledge universe.** Explore how people, inventions, discoveries, events and ideas connect across human knowledge.

## Project structure

```text
the-connection/
├── index.html                 # Main website entry point
├── .nojekyll                  # Publish static files without Jekyll processing
├── README.md                  # Project documentation
├── assets/
│   ├── css/
│   │   └── style.css          # Website styles
│   └── js/
│       └── app.js             # Graph, search and interaction logic
└── data/
    ├── nodes.json             # Knowledge topics
    └── connections.json       # Relationships between topics
```

## Current knowledge dataset

- **59 discoveries** (nodes)
- **89 connections** (edges)
- **6 domains:** Technology, Science, History, Geography, Culture and Humanity

The homepage counters are calculated from the loaded dataset, so they stay accurate when topics or connections are added.

## Features

- Interactive knowledge graph powered by Cytoscape.js
- Search across topics and descriptions
- Topic detail panels and related connections
- Connection Finder using breadth-first search
- Timeline of selected discoveries
- Local bookmarks in My Discoveries
- Wikipedia source links on researched topics

## Run locally

Run the project through a local static server, such as VS Code Live Server. The website loads JSON files with `fetch`, so opening `index.html` directly as a file may prevent the data from loading.

## Deploy with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**.
4. Save and wait for GitHub to publish the site.

The expected project-site address is:

https://sarker908.github.io/the-connection/

## Research and attribution

The dataset uses concise original summaries informed by Wikipedia research. Topic records may include a `wiki` URL, which appears in the topic detail panel as a source link. This is a curated static dataset, not a live Wikipedia scraper. Follow each linked article for its current revision and references.

## Technology

HTML, CSS, vanilla JavaScript, Cytoscape.js, JSON and browser LocalStorage. No backend or paid API is required.
