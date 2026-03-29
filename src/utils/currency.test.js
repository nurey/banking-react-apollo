import { describe, it, expect } from 'vitest';
import { formatCents } from './currency';

describe('formatCents', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCents(500)).toBe('5.00');
  });

  it('formats amounts with cents', () => {
    expect(formatCents(4599)).toBe('45.99');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('0.00');
  });

  it('formats single-digit cent amounts', () => {
    expect(formatCents(1)).toBe('0.01');
  });

  it('formats large amounts', () => {
    expect(formatCents(1000000)).toBe('10000.00');
  });
});
