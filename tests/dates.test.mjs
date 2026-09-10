import test from 'node:test';
import assert from 'node:assert/strict';
import { wholeYearsSince, monthYear } from '../src/utils/dates.mjs';

test('experience advances on the June anniversary, not January or July', () => {
  assert.equal(
    wholeYearsSince('2019-06-01', new Date('2026-01-01T00:00:00Z')),
    6
  );
  assert.equal(
    wholeYearsSince('2019-06-01', new Date('2026-05-31T23:59:59Z')),
    6
  );
  assert.equal(
    wholeYearsSince('2019-06-01', new Date('2026-06-01T00:00:00Z')),
    7
  );
  assert.equal(
    wholeYearsSince('2019-06-01', new Date('2030-06-01T00:00:00Z')),
    11
  );
});
test('future or invalid starts do not show negative or NaN experience', () => {
  assert.equal(
    wholeYearsSince('2019-06-01', new Date('2018-01-01T00:00:00Z')),
    0
  );
  assert.equal(wholeYearsSince('invalid'), 0);
});
test('employment months use UTC and preserve the confirmed end date', () => {
  assert.equal(monthYear('2026-09-07'), 'September 2026');
  assert.equal(monthYear('2024-07-01'), 'July 2024');
  assert.equal(monthYear('2024-07'), 'July 2024');
});
