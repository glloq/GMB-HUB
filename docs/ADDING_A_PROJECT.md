# Adding a project

The target workflow is deliberately data-only.

1. Audit the source repository and record evidence.
2. Copy `data/templates/project.template.json` to `data/projects/<id>.json`.
3. Fill only facts that can be verified; keep unknown values null/unknown.
4. Add media with provenance when required.
5. Add relations to successors/predecessors where relevant.
6. Run `npm run validate:data`.
7. Commit the data record.

A normal project addition must not require editing page components.

## Before claiming hardware support

Distinguish clearly among:

- source code exists;
- firmware compiles;
- automated logic tests pass;
- board has been powered and exercised;
- mechanism has been physically tested;
- complete instrument behavior has been validated.
