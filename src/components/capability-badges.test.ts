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

  it('groups controller variants into visual board families', () => {
    const html = renderBoardBadges(['esp32-s3', 'esp32-wroom-32', 'arduino-leonardo'], true);
    expect(html).toContain('board-family--compact');
    expect(html).toContain('images/boards/esp32.svg');
    expect(html).toContain('images/boards/arduino.svg');
    expect(html).toContain('ESP32 family');
    expect(html).toContain('Arduino family');
    expect(html.match(/images\/boards\/esp32\.svg/g)?.length).toBe(1);
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
