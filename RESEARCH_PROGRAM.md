# The Connection: Global Research & Editorial Programme

**Purpose:** grow the atlas into a dependable, globally representative guide to human knowledge without confusing catalogue size with research quality.

This programme works with the existing static-site architecture: HTML, CSS, vanilla JavaScript and JSON. It does not require a backend, paid API, framework migration or a redesign of the existing experience.

## Verified baseline

Baseline inspected on 28 November 2026:

- 2,280 subjects
- 500 collections
- 1,663 relationships
- 1,213 unique source records
- 132 historical milestones
- 81 biographical profiles

Subject editorial statuses:

| Status | Count | Meaning |
| --- | ---: | --- |
| starter | 1,233 | Template-based introduction; substantive research required |
| review-pending | 1,037 | Entry exists but has not passed a documented editorial review |
| research-enriched | 10 | Rewritten against named references; independent subject-expert review still pending |
| reviewed | 0 recorded in this baseline | Reserved for a documented review pass |

Source-register classes:

| Class | Records |
| --- | ---: |
| Encyclopedia | 1,136 |
| Academic or educational | 19 |
| Institutional or official | 58 |

The source register is a provenance and discovery layer, not a claim-level verification system. Every subject currently has at least one registered source, but a linked source does not prove every sentence in a subject description. The current dataset also has no recorded subject-expert review status.

Structural checks on this baseline found no missing subject fields among the required description, short summary, wiki URL and editorial status fields; no connections with missing endpoint subjects or labels; and no duplicate unordered subject pairs.

## Editorial principles

1. Accuracy before volume. Do not add entries merely to increase the headline count.
2. Explain in original, accessible language. Do not copy source passages.
3. Use evidence appropriate to the claim: primary records for original events and data; peer-reviewed research and academic books for specialist science; universities, national academies, museums, archives and public institutions for specialist explanations.
4. Distinguish established findings, interpretation, uncertainty and active debate.
5. Represent knowledge globally. Include scholarship, histories and knowledge traditions beyond Europe and North America, while applying the same evidence standards.
6. Make relationships meaningful. A connection must explain a causal, historical, methodological, conceptual or practical relationship, not merely a shared category.
7. Never invent a citation, publication date, author, statistic, quotation or review.
8. Keep the existing website usable while datasets grow.

## Research workflow: batches of 25

Work in small, auditable batches of no more than 25 subjects.

For each subject:

1. Define its scope and the questions a reader should be able to answer.
2. Check the current description, dates, terminology and subject boundaries.
3. Find at least two independent, subject-specific references where practical. Prefer primary, academic and specialist institutional sources.
4. Record each reference's title, publisher, URL, source class and the specific contribution it supports.
5. Write a concise original overview, with a short summary that accurately reflects it.
6. Check names, dates, units, definitions, geographical context and uncertainty.
7. Review existing relationships and add only links with a clear explanation.
8. Record the research date and a concise editorial note.
9. Set `research-enriched` only after the documented research pass. Set `reviewed` only after a separate review checks claims, dates, wording and references.

A subject should remain `starter` or `review-pending` when evidence is incomplete. Do not promote status to make the dashboard look better.

## Priority sequence

### Track A: foundations that unlock other subjects
- Mathematics, number systems, algebra, geometry and statistics
- Scientific method, measurement and experimental design
- Matter, energy, motion, electricity and electromagnetism
- Evolution, genetics, cells and ecosystems
- Earth systems, climate and oceans
- Computing, algorithms, networks and information

### Track B: people, societies and institutions
- World history across regions and periods
- South Asian, Bengal and Bangladesh histories in wider global context
- Languages, writing systems, literature and knowledge transmission
- Political institutions, law, economics and social change
- Religion, philosophy and cultural traditions, handled with respectful context

### Track C: applied knowledge and contemporary challenges
- Medicine and public health
- Agriculture, food systems and biodiversity
- Engineering, architecture, transport and infrastructure
- Energy, materials and manufacturing
- Artificial intelligence, privacy, cybersecurity and digital society

Within each track, select the next 25 subjects by foundational importance, reader usefulness, current evidence gaps and the ability to create well-supported cross-disciplinary relationships. Publish the batch scope before editing it.

## Source and claim traceability: next data-model improvement

The current source registry links sources to subject IDs, but does not state which individual claims a source supports. Future research updates should add claim-level provenance without breaking the current reader:

- Stable claim IDs attached to a subject.
- A concise factual claim in original wording.
- One or more source IDs from the central registry.
- A note describing the evidence or relevant section.
- Optional date/period and uncertainty note.
- A review state distinct from the subject's overall editorial status.

Do not retrofit claim-level citations by guessing which source supports existing sentences. Add them during a fresh research pass.

## Relationship quality

For every new or revised relationship:

- Keep stable, unique IDs and valid subject endpoints.
- Explain the relationship in plain language.
- Prefer a precise relationship type such as causal, historical, conceptual, methodological, technological or contextual.
- Avoid reciprocal duplicates unless the reverse direction genuinely expresses a different meaning.
- Check whether the relationship helps a reader understand something they could not see from the two subject summaries alone.

## Quality gates before publishing a batch

- JSON parses successfully.
- Subject and source IDs are unique.
- Every relationship endpoint exists.
- Every relationship has a meaningful explanation.
- Every source URL is valid and its title/publisher match the destination.
- Independent sources are not counted twice merely because they mirror the same underlying material.
- Dates, quantities and quotations are checked against the cited source.
- Editorial statuses reflect work actually completed.
- Existing search, collections, subject panels, timeline, saved items and reading journeys still work.
- The live GitHub Pages site is checked after deployment.

## Progress reporting

Report counts separately for:
- subjects researched in the current batch;
- subjects awaiting independent review;
- subjects that passed documented review;
- academic, primary and institutional sources added;
- claims with traceable references;
- relationships added or improved;
- structural and live-site checks passed.

Never present the total number of links or sources as a quality score.

## Immediate next milestone

Complete the next 25-subject research batch using the priority sequence above. Before changing the data, publish its subject list and research scope. After the batch, run structural checks, review the diff and test the deployed website. Preserve all existing sections and the current static architecture.


## Research Batch 002: Foundational Sciences and Computing

**Completed:** 28 November 2026  
**Subjects enriched:** 25 existing subjects  
**New claim-level records:** 50  
**Source records linked:** 34

This batch covers mathematics (set theory, prime factorization, group theory, linear algebra, probability and modular arithmetic), physics (quantum mechanics, entanglement, the Standard Model, entropy, electromagnetism and lasers), isotopes, cell biology and microbiology, plate tectonics, the atmosphere, the water cycle, and core computer-science topics (sorting, graph theory, relational databases, compilers and encryption).

All 25 entries were rewritten in original language and linked to two distinct institutional, academic, university or open-textbook references. Two claim-level provenance records were added per subject in `data/claims.json`. Existing subjects and relationships were preserved; the atlas subject and connection totals were not increased.

**Editorial status:** research-enriched, not expert-reviewed. Claims remain editorial-review-pending. References provide traceability and further reading, not proof that every sentence has been independently verified. The website's visible source presentation and live deployment must be checked separately.

**Next milestone:** Batch 003 should select 25 further subjects from the remaining unresearched atlas, prioritising global history, public health, climate and environment, and foundational engineering. After the next data batch, integrate claim/source references into the subject detail interface and run a deployed-site regression check.
