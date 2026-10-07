import { describe, expect, it } from 'vitest';
import { getMidiInputTransports, renderBoardBadges, renderMidiInputBadges } from './capability-badges';
import type { MidiTransport } from '../models/project';

const transports: MidiTransport[] = [
  { id: 'usb-midi', status: 'implemented', direction: 'bidirectional' },
  { id: 'ble-midi', status: 'experimental', direction: 'input' },
  { id: 'din-midi', status: 'planned', direction: 'input' },
  { id: 'web-ui', status: 'implemented', direction: 'input' },
  { id: 'rtp-midi', status: 'implemented', direction: 'output' },
];

describe('capability badges', () => {
  it('keeps only currently usable MIDI reception transports', () => {
    expect(getMidiInputTransports(transports).map((item) => item.id)).toEqual(['usb-midi', 'ble-midi']);
  });

  it('renders friendly board labels', () => {
    const html = renderBoardBadges(['esp32-s3', 'arduino-leonardo'], true);
    expect(html).toContain('ESP32-S3');
    expect(html).toContain('Arduino Leonardo');
  });

  it('renders MIDI reception badges and status styling', () => {
    const html = renderMidiInputBadges(transports, true);
    expect(html).toContain('USB MIDI');
    expect(html).toContain('BLE MIDI');
    expect(html).toContain('capability-chip--experimental');
    expect(html).not.toContain('MIDI DIN');
    expect(html).not.toContain('Web Ui');
  });
});
