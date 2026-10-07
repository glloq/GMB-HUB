import { describe, expect, it } from 'vitest';
import { escapeHtml, labelize } from './html';

describe('HTML utilities', () => {
  it('escapes user-facing HTML characters', () => {
    expect(escapeHtml('<script>"x" & y</script>')).toBe('&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;');
  });

  it('turns canonical identifiers into readable labels', () => {
    expect(labelize('stepper-plucked-string')).toBe('Stepper Plucked String');
  });
});
