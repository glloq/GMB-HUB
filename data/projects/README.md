# Canonical project records

This directory will contain one JSON file per GMB HUB project.

The skeleton intentionally contains no real project records yet. The next phase will audit the source repositories and add records backed by evidence.

Rules:

- file name must match `id` (for example `servo-flute.json` → `id: servo-flute`);
- unknown facts use `null` or `unknown`, never guesses;
- software validation and physical hardware validation are separate;
- legacy/successor relationships are explicit;
- all files must validate against `schema/project.schema.json`.
