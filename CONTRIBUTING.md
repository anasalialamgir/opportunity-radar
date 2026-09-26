# Contributing to Opportunity Radar 🚀

Thank you for contributing to Opportunity Radar! We welcome new source connectors, AI provider adapters, bug fixes, and documentation improvements.

---

## How to Add an Opportunity Source

1. **Create a new folder** under `sources/`:
   ```bash
   sources/my-new-source/
   ├── source.ts      # Implements OpportunitySource
   ├── tests.ts       # Verification test
   └── README.md      # Documentation & rate limits
2. ​Implement the OpportunitySource interface:
​id: unique lowercase string (e.g. "reddit-forhire")
​name: user-facing display name
​healthCheck(): returns service health and latency
​search(query): fetches and returns an array of RawOpportunity objects

3. ​Register your source in lib/sources/registry.ts.
4. ​Verify your source:
​Every opportunity must link to a real, accessible URL.
​Do not fabricate listings.
​Never leak user profile information, CVs, or emails to external sources.
​
Submitting a Pull Request (PR)

​Fork the repository.
​Create a feature branch: git checkout -b feature/new-source-adapter.
​Commit your changes with a clear description.
​Push to your branch and open a Pull Request against main.
