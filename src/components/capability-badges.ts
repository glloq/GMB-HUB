import type { MidiTransport } from '../models/project';
import { escapeHtml, labelize } from '../utils/html';

interface BadgeDefinition {
  label: string;
  token: string;
}

const BOARD_BADGES: Record<string, BadgeDefinition> = {
  esp32: { label: 'ESP32', token: '32' },
  'esp32-wroom-32': { label: 'ESP32-WROOM-32', token: '32' },
  'esp32-s2': { label: 'ESP32-S2', token: 'S2' },
  'esp32-s3': { label: 'ESP32-S3', token: 'S3' },
  'arduino-leonardo': { label: 'Arduino Leonardo', token: 'L' },
  'arduino-micro': { label: 'Arduino Micro', token: 'µ' },
  'arduino-uno': { label: 'Arduino Uno', token: 'UNO' },
  'raspberry-pi': { label: 'Raspberry Pi', token: 'Pi' },
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
  return boardIds.map((id) => {
    const badge = BOARD_BADGES[id] ?? fallbackBadge(id);
    return `<span class="capability-chip capability-chip--board${compact ? ' capability-chip--compact' : ''}" title="Compatible board: ${escapeHtml(badge.label)}"><b>${escapeHtml(badge.token)}</b><span>${escapeHtml(badge.label)}</span></span>`;
  }).join('');
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
