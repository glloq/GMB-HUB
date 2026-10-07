import type { MidiTransport } from '../models/project';
import { escapeHtml, labelize } from '../utils/html';

interface BadgeDefinition {
  label: string;
  token: string;
}

interface BoardFamilyDefinition {
  id: string;
  label: string;
  image: string;
}

const BOARD_FAMILIES: Record<string, BoardFamilyDefinition> = {
  esp32: { id: 'esp32', label: 'ESP32 family', image: 'images/boards/esp32.svg' },
  'esp32-wroom-32': { id: 'esp32', label: 'ESP32 family', image: 'images/boards/esp32.svg' },
  'esp32-s2': { id: 'esp32', label: 'ESP32 family', image: 'images/boards/esp32.svg' },
  'esp32-s3': { id: 'esp32', label: 'ESP32 family', image: 'images/boards/esp32.svg' },
  'arduino-leonardo': { id: 'arduino', label: 'Arduino family', image: 'images/boards/arduino.svg' },
  'arduino-micro': { id: 'arduino', label: 'Arduino family', image: 'images/boards/arduino.svg' },
  'arduino-uno': { id: 'arduino', label: 'Arduino family', image: 'images/boards/arduino.svg' },
  'raspberry-pi': { id: 'raspberry-pi', label: 'Raspberry Pi family', image: 'images/boards/raspberry-pi.svg' },
};

const MIDI_BADGES: Record<string, BadgeDefinition> = {
  'usb-midi': { label: 'USB MIDI', token: 'USB' },
  'midi-usb': { label: 'USB MIDI', token: 'USB' },
  'ble-midi': { label: 'BLE MIDI', token: 'BLE' },
  'din-midi': { label: 'MIDI DIN', token: 'DIN' },
  'rtp-midi': { label: 'RTP-MIDI', token: 'RTP' },
  'wifi-udp': { label: 'Wi-Fi UDP', token: 'UDP' },
  'serial-midi': { label: 'Serial MIDI', token: 'SER' },
};

const NON_CONNECTION_INPUTS = new Set(['web-ui', 'web-keyboard', 'local-midi-file', 'sysex']);
const AVAILABLE_STATUSES = new Set<MidiTransport['status']>(['implemented', 'experimental', 'legacy']);

function fallbackBadge(id: string): BadgeDefinition {
  const label = labelize(id);
  return { label, token: label.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || '?' };
}

export function getMidiInputTransports(transports: MidiTransport[]): MidiTransport[] {
  return transports.filter((transport) =>
    (transport.direction === 'input' || transport.direction === 'bidirectional')
      && AVAILABLE_STATUSES.has(transport.status)
      && !NON_CONNECTION_INPUTS.has(transport.id),
  );
}

export function renderBoardBadges(boardIds: string[], compact = false): string {
  if (!boardIds.length) return '<span class="capability-empty">Not documented</span>';

  const families = new Map<string, { definition: BoardFamilyDefinition; models: string[] }>();
  const unknown: string[] = [];

  for (const boardId of boardIds) {
    const family = BOARD_FAMILIES[boardId];
    if (!family) {
      unknown.push(boardId);
      continue;
    }
    const existing = families.get(family.id) ?? { definition: family, models: [] };
    existing.models.push(labelize(boardId));
    families.set(family.id, existing);
  }

  const familyMarkup = [...families.values()].map(({ definition, models }) => {
    const src = `${import.meta.env.BASE_URL}${definition.image}`;
    const title = `${definition.label}: ${models.join(', ')}`;
    return `<span class="board-family${compact ? ' board-family--compact' : ''}" title="${escapeHtml(title)}"><img src="${escapeHtml(src)}" alt="${escapeHtml(definition.label)}" loading="lazy" decoding="async"><span>${escapeHtml(definition.label)}</span></span>`;
  }).join('');

  const fallbackMarkup = unknown.map((id) => {
    const badge = fallbackBadge(id);
    return `<span class="capability-chip capability-chip--board${compact ? ' capability-chip--compact' : ''}" title="Compatible board: ${escapeHtml(badge.label)}"><b>${escapeHtml(badge.token)}</b><span>${escapeHtml(badge.label)}</span></span>`;
  }).join('');

  return familyMarkup + fallbackMarkup;
}

export function renderMidiInputBadges(transports: MidiTransport[], compact = false): string {
  const inputs = getMidiInputTransports(transports);
  if (!inputs.length) return '<span class="capability-empty">Not documented</span>';
  return inputs.map((transport) => {
    const badge = MIDI_BADGES[transport.id] ?? fallbackBadge(transport.id);
    const statusClass = transport.status === 'experimental'
      ? ' capability-chip--experimental'
      : transport.status === 'legacy'
        ? ' capability-chip--legacy'
        : '';
    const title = `${badge.label} · ${labelize(transport.status)} · ${labelize(transport.direction)}`;
    return `<span class="capability-chip capability-chip--midi${statusClass}${compact ? ' capability-chip--compact' : ''}" title="${escapeHtml(title)}"><b>${escapeHtml(badge.token)}</b><span>${escapeHtml(badge.label)}</span></span>`;
  }).join('');
}
