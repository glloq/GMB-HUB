export type GmbFeatureStatus = 'core' | 'usable' | 'partial' | 'experimental' | 'host-dependent';

export interface GmbFeature {
  title: string;
  status: GmbFeatureStatus;
  summary: string;
  details: string[];
}

export const gmbProduct = {
  eyebrow: 'The orchestration core of the GMB ecosystem',
  title: 'General MIDI Boop',
  lede:
    'A local-first orchestration system for building, discovering, configuring and playing a complete orchestra of mechanical MIDI instruments from one Raspberry Pi interface.',
  description:
    'GMB is not only a MIDI player. It is the coordination layer between MIDI sources, instrument capabilities and the physical machines that make the music: it discovers compatible devices, understands what they can play, assigns and adapts musical parts, provides live and arranged performance tools, edits MIDI material, can transcribe audio to MIDI, and synchronizes stage lighting.',
  facts: [
    ['Host', 'Raspberry Pi 3B+ / 4 / 5'],
    ['Scale', 'Up to 16 instruments'],
    ['Operation', 'Local / offline-first web UI'],
    ['Languages', '28 interface languages'],
  ] as const,
  architecture: {
    inputs: ['USB MIDI', 'BLE MIDI', 'DIN / GPIO MIDI', 'RTP-MIDI / network', 'MIDI files', 'Audio transcription', 'Virtual keyboards'],
    core: ['Discover', 'Describe capabilities', 'Route', 'Assign', 'Adapt', 'Arrange', 'Edit', 'Synchronize'],
    outputs: ['Mechanical instruments', 'Generic GMB controllers', 'Lighting / DMX / WLED', 'MIDI outputs'],
  },
  features: [
    {
      title: 'Instrument discovery & GMB v2 capabilities',
      status: 'core',
      summary: 'Compatible instruments can identify themselves and describe their musical and mechanical capabilities to the host.',
      details: [
        'GMB v2 SysEx handshake and segmented capability descriptors.',
        'Descriptor-driven identity and capability resolution with change notification support.',
        'The host can use declared ranges, polyphony, supported controls and mechanical constraints instead of treating every MIDI device as identical.',
      ],
    },
    {
      title: 'Automatic assignment & musical adaptation',
      status: 'core',
      summary: 'GMB matches MIDI material to the instruments that can actually perform it.',
      details: [
        'Automatic channel assignment with scoring.',
        'Channel splitting across multiple instruments.',
        'Note-range transposition, polyphony adaptation and General MIDI percussion remapping.',
        'Support for instrument-specific constraints such as hands, strings, note selections and control capabilities.',
      ],
    },
    {
      title: 'MIDI connectivity & live routing',
      status: 'usable',
      summary: 'Multiple MIDI transports feed the same orchestration layer and can be routed to configured destinations.',
      details: [
        'USB MIDI with discovery / hot-plug support.',
        'Bluetooth LE MIDI and physical DIN/GPIO UART MIDI.',
        'Live routing UI and routing commands are present in the current codebase.',
        'RTP-MIDI/network support exists but remains explicitly experimental and is not full AppleMIDI/RFC 6295 compatibility.',
      ],
    },
    {
      title: 'Playback, timing & performance',
      status: 'core',
      summary: 'The playback engine coordinates many physical instruments while accounting for capabilities and timing.',
      details: [
        'Playback for an orchestra of up to 16 instruments.',
        'Per-device latency compensation and timing controls.',
        'Optional MIDI clock generation.',
        'Virtual keyboards and instrument-aware live controls.',
      ],
    },
    {
      title: 'Loop Manager & multitrack arranging',
      status: 'usable',
      summary: 'GMB includes composition and performance tools rather than requiring every musical sequence to be prepared elsewhere.',
      details: [
        'Loop library and creation workflow.',
        'Trigger pads and live performance view.',
        'Multitrack arranger with tracks, blocks and arrangement commands.',
        'Playback routing from loop workflows back into the GMB instrument system.',
      ],
    },
    {
      title: 'MIDI editing',
      status: 'usable',
      summary: 'The web interface provides several instrument-oriented ways to inspect and edit musical material.',
      details: [
        'Piano-roll editing.',
        'Percussion-oriented editing.',
        'Tablature / string-oriented views.',
        'Wind-instrument-oriented views and channel information tools.',
      ],
    },
    {
      title: 'Audio → MIDI transcription',
      status: 'usable',
      summary: 'Audio can be converted locally into MIDI material and brought back into the GMB workflow.',
      details: [
        'End-to-end transcription pipeline with job lifecycle, progress and cancellation.',
        'Interchangeable transcription backends run as separate processes.',
        'Audio preprocessing, musical result normalization and MIDI encoding are separated stages.',
        'Optional feature: backend availability and performance depend on the Raspberry Pi / host configuration.',
      ],
    },
    {
      title: 'Lighting & show control',
      status: 'host-dependent',
      summary: 'Lighting can react to MIDI playback so the mechanical orchestra and the stage share the same timeline.',
      details: [
        'GPIO LEDs and addressable strips.',
        'ArtNet DMX and sACN/E1.31.',
        'OSC, HTTP/WLED and MQTT driver architecture.',
        'Rule-based reactions can use notes, velocity and CC values; individual drivers still depend on host libraries, network services or physical hardware.',
      ],
    },
    {
      title: 'Standalone Raspberry Pi appliance',
      status: 'host-dependent',
      summary: 'The system is designed to run beside the orchestra without requiring a cloud backend.',
      details: [
        'Touch-friendly browser interface served locally.',
        'Offline-first operation for the core orchestration workflow.',
        'Raspberry Pi 3B+, 4 and 5 are documented targets.',
        'Hardware transports such as BLE, GPIO MIDI and GPIO lighting require the corresponding Raspberry Pi services and peripherals.',
      ],
    },
  ] satisfies GmbFeature[],
  transportMatrix: [
    ['USB MIDI', 'Implemented', 'Bidirectional', 'Discovery and hot-plug are part of the host device layer.'],
    ['BLE MIDI', 'Implemented', 'Bidirectional', 'Requires Bluetooth services / hardware on the host.'],
    ['DIN / GPIO', 'Implemented', 'Bidirectional', '31,250 baud physical MIDI through Raspberry Pi UART.'],
    ['RTP-MIDI', 'Experimental', 'Bidirectional', 'Network MIDI exists, but the repository does not claim complete AppleMIDI/RFC 6295 compliance.'],
  ] as const,
  statusNotes: [
    'The repository contains substantially more functionality than the previous GMB HUB card exposed; this page is based on the current README, source tree and internal audits rather than the old short catalogue description.',
    'Not every capability has the same validation level. Network MIDI, Raspberry Pi hardware paths and some lighting drivers depend on the target environment and are intentionally not labelled as universally hardware-validated.',
    'The compatibility list below is generated from GMB HUB project metadata so it can evolve independently from older compatibility lists in the General MIDI Boop README.',
  ],
} as const;
