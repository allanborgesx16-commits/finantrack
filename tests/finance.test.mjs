import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMoney, totals, monthRows, shiftMonth, csv, localDate } from '../src/lib/finance.mjs';
test('Brazilian currency accepts comma and thousands without truncating cents', () => {
  assert.equal(parseMoney('1.234,56'), 1234.56);
  assert.equal(parseMoney('19,90'), 19.9);
  assert.equal(parseMoney('19.90'), 19.9);
  for (const value of ['0', '-20', '10abc', '2,345', 'Infinity', '', '10000000000']) assert.equal(parseMoney(value), null);
});
test('totals use cents and month boundaries exclude adjacent months', () => {
  const data = [{ type: 'income', amount: 0.3, date: '2026-10-01' }, { type: 'expense', amount: 0.1, date: '2026-10-31' }, { type: 'expense', amount: 10, date: '2026-11-01' }];
  assert.deepEqual(totals(monthRows(data, '2026-10')), {income:0.3,expense:0.1,balance:0.2});
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(shiftMonth('2026-01', -1), '2025-12');
  assert.equal(localDate(new Date(2026, 9, 31, 23, 59)), '2026-10-31');
});
test('CSV safely escapes separators, quotes and spreadsheet formulas', () => {
  const result = csv([{date:'2026-10-01',type:'expense',description:' =HYPERLINK("x");café',category:'Outros',amount:19.9}]);
  assert.ok(result.includes('"\' =HYPERLINK(""x"");café"'));
  assert.ok(result.includes('"19,90"'));
});
