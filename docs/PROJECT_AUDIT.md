# Ecosystem audit — working inventory

This file tracks the evidence used by GMB HUB. It is not a claim that every listed repository belongs in the final public catalog.

## Published catalog records

| Project | Role | Maturity | Hardware | GMB | Notes |
|---|---|---|---|---|---|
| General-Midi-Boop | software/orchestrator | software-ready | n/a/unknown | current host protocol | Central Raspberry Pi application. |
| PlayMode-GMB | generic controller | software-ready | not tested | native v2 | Beta/no-code ESP32 controller. |
| Drums-Engine-GMB | percussion | software-ready | unknown | native v2 | GMB descriptor and change notification documented. |
| Servo-Flute-GMB | wind | bench-ready | not tested | native v2 | Physical servo/air/microphone validation still pending. |
| Servo-Plucked-Strings-GMB | plucked strings | bench-ready | not tested | native, version not asserted | Dedicated servo-fret architecture. |
| Stepper-Plucked-Strings-GMB | plucked strings | bench-ready | not tested | native v2 | Moving-finger stepper architecture. |
| Servo-bowed-strings-GMB | bowed strings | bench-ready | not tested | native, version not asserted | Physical bow-wheel validation pending. |
| stepper-bowed-string-GMB | bowed strings | bench-ready | not tested | native, version not asserted | Physical bow-wheel validation pending. |
| slide_Whistle-GMB | wind | software-ready | partial/legacy evidence | native v2 on ESP32 | Repository contains legacy Arduino and newer ESP32 generations. |
| servo-Melodica-GMB | melodica | software-ready | not tested | planned | Do not advertise discovery until repository evidence exists. |
| Orchestrion_trumpet | brass | bench-ready | not tested | planned | Software is explicitly ahead of bench validation. |
| harmonica_Midi | wind | concept | not tested | planned | Physical project remains explicitly described as an idea. |
| Accordion-servo-midi | accordion | software-ready | not tested | planned | Current active firmware remains ATmega32U4-based. |
| 16-cords-lyre-midi | legacy plucked strings | validated | tested | none | Repository explicitly describes the physical project as functional and finished. |
| stepper-midi-4-cords-instrument | legacy plucked strings | legacy | unknown | none | Replaced in the HUB by Stepper-Plucked-Strings-GMB for new builds. |
| ukuletron | legacy plucked strings | legacy/WIP | partial | none | Useful solenoid-fret mechanical reference; synchronization and heat concerns remain documented. |
| Orchestrion_Piano | legacy keyboard | legacy | not tested | none | Code compiles, but repository explicitly says no physical validation was performed. |
| MidiUSB-MCP23017-Piano | archived keyboard | archived | unknown | none | Repository explicitly marks the project inactive. |
| Orchestrion-Xylophone | legacy percussion | legacy | unknown | legacy SysEx identification | Code described as functional, larger range still needs rework. |
| pipeOrgan | legacy concept | concept | not tested | none | Explicitly a collection of design ideas. |
| servo-midi-music | legacy generic servo controller | legacy | not tested | none | Code complete according to README, hardware not tested. |
| Solenoid-Midi-Music | legacy generic solenoid controller | legacy | unknown | none | Generic 1–128 solenoid reference; PlayMode is preferred for new generic builds. |

## Not published to the public catalog yet

- `midi-hand-pinao`: repository is currently private. Do not copy private repository content into this public repository without an explicit publication decision.

## Remaining legacy/reference audit queue

- Orchestrion_Plucked_Strings_Solenoids
- Continuous_PluckStepper
- ukulele_stepper_motor
- servo-flute
- Orchestrion-Project

## Audit checklist per repository

- role and family;
- active/legacy/successor relation;
- supported physical instruments;
- controller boards;
- actuators/drivers/sensors;
- power requirements;
- mechanical principle;
- fabrication resources;
- MIDI transports/messages;
- GMB protocol/integration;
- build environments;
- automated tests/CI;
- actual hardware validation;
- BOM/schematics/CAD/media;
- licence;
- missing or contradictory information.

## Evidence policy

- Do not infer maturity from a repository name.
- Do not treat a successful firmware build as hardware validation.
- Do not turn a future-compatibility list in another repository into proof of implemented GMB discovery.
- Prefer `null`, `unknown` or `planned` over guessing.
- A private repository is not a source for the public catalog unless its publication is explicitly intended.
