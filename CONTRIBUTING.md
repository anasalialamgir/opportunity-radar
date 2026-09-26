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
