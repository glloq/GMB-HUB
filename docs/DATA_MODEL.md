# Canonical data model

The project record is the source of truth for how GMB HUB classifies a repository.

## Important semantics

- `null` means unknown/not documented.
- `false` means explicitly known to be false.
- `not-tested` means implemented or present but not physically/software tested in the relevant domain.
- `legacy` means preserved but no longer the preferred architecture.
- status is multidimensional: software, hardware, documentation and GMB integration are independent.

## Registries

- `data/categories.json`: broad instrument/project families.
- `data/boards.json`: controller boards used for filters and flash targets.
- `data/actuators.json`: normalized actuator families.

## Project identity

`data/projects/<id>.json` must use the same `<id>` internally. IDs are stable slugs and should not be renamed just because a repository display name changes.

## Relations

`replaces`, `replacedBy` and `related` point to other canonical project IDs, never raw repository names.

## Firmware

A project can contain source firmware without being browser-flashable. `firmware.available` and `flash.supported` are intentionally separate.
