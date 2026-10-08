// 日期推算 / 间隔的计算核心测试。运行：node --test "tests/*.test.cjs"
// 直接从 index.html 里抽出「calc-core:start ~ calc-core:end」那一段来跑，测的就是线上那份代码，不另抄一份
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/\/\/ ==== calc-core:start[\s\S]*?\/\/ ==== calc-core:end ====/);
if (!m) throw new Error('index.html 里找不到 calc-core 标记段');
const ctx = {};
vm.runInNewContext(m[0] + '\nthis.core = { pointToMs, addMonthsClamped, addDuration, diffPoints, formatDiffText, daysInMonthOf };', ctx);
const { pointToMs, addMonthsClamped, addDuration, diffPoints, formatDiffText, daysInMonthOf } = ctx.core;

const P = (s) => {   // 'YYYY-MM-DD hh:mm:ss' → 时间点
  const [d, t = '00:00:00'] = s.split(' ');
  const [year, month, day] = d.split('-').map(Number);
  const [hour, minute, second] = t.split(':').map(Number);
  return { year, month, day, hour, minute, second };
};
const S = (p) => p && `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')} ` +
  `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}:${String(p.second).padStart(2, '0')}`;
const DUR0 = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, sleepCycles: 0 };
const dur = (o) => Object.assign({}, DUR0, o);

test('加减月份：月末收敛到当月最后一天，不往下个月溢出', () => {
  assert.equal(S(addDuration(P('2026-01-31'), dur({ months: 1 }), 1)), '2026-02-28 00:00:00');
  assert.equal(S(addDuration(P('2024-01-31'), dur({ months: 1 }), 1)), '2024-02-29 00:00:00');
  assert.equal(S(addDuration(P('2026-03-31'), dur({ months: 1 }), -1)), '2026-02-28 00:00:00');
  assert.equal(S(addDuration(P('2026-05-31'), dur({ months: 1 }), -1)), '2026-04-30 00:00:00');
  assert.equal(S(addDuration(P('2024-02-29'), dur({ years: 1 }), 1)), '2025-02-28 00:00:00');
  assert.equal(S(addDuration(P('2024-02-29'), dur({ years: 4 }), 1)), '2028-02-29 00:00:00');
  assert.equal(S(addDuration(P('2026-01-15'), dur({ months: 13 }), -1)), '2024-12-15 00:00:00');
});

test('加减定长单位与睡眠周期', () => {
  assert.equal(S(addDuration(P('2026-12-31 23:59:59'), dur({ seconds: 1 }), 1)), '2027-01-01 00:00:00');
  assert.equal(S(addDuration(P('2026-10-08 23:00:00'), dur({ sleepCycles: 5 }), 1)), '2026-10-09 06:30:00');
  assert.equal(S(addDuration(P('2026-03-01'), dur({ days: 1 }), -1)), '2026-02-28 00:00:00');
  // 先年月、后日：1月31日 +1月 +1天 = 3月1日（2月28日再加 1 天）
  assert.equal(S(addDuration(P('2026-01-31'), dur({ months: 1, days: 1 }), 1)), '2026-03-01 00:00:00');
});

test('超出公元 1–9999 年返回 null，不再显示 NaN', () => {
  assert.equal(addDuration(P('2026-01-01'), dur({ years: 999999 }), 1), null);
  assert.equal(addDuration(P('2026-01-01'), dur({ years: 8000 }), 1), null);
  assert.equal(addDuration(P('2026-01-01'), dur({ years: 2026 }), -1), null);
  assert.equal(S(addDuration(P('2026-01-01'), dur({ years: 2025 }), -1)), '1-01-01 00:00:00');
  assert.equal(addDuration(P('2026-01-01'), dur({ days: 1e12 }), 1), null);
});

test('0–99 年不会被当成 19xx 年', () => {
  assert.equal(daysInMonthOf(4, 2), 29);
  assert.equal(S(addDuration(P('50-03-01'), dur({ days: 1 }), -1)), '50-02-28 00:00:00');
});

test('间隔：典型例子（原来会算出负数天的几组）', () => {
  const t = (a, b) => formatDiffText(diffPoints(P(a), P(b)));
  assert.equal(t('2026-01-31', '2026-03-01'), '相差 1个月1天');
  assert.equal(t('2026-01-30 12:00:00', '2026-03-01'), '相差 1个月12小时');
  assert.equal(t('2026-01-01', '2026-01-03'), '相差 2天');
  assert.equal(t('2024-01-01', '2025-01-01'), '相差 1年');
  assert.equal(t('2026-03-01', '2026-01-31'), '相差(反向) 1个月1天');
  assert.equal(t('2026-10-08 09:00:00', '2026-10-08 09:00:00'), '时间完全相同');
  assert.equal(t('2025-12-31 23:59:59', '2026-01-01 00:00:00'), '相差 1秒');
});

test('间隔与推算互逆 + 每一位都在合法范围（随机 20000 组）', () => {
  let seed = 20261008;
  const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
  const randPoint = () => {
    const year = 1000 + rnd(2001), month = 1 + rnd(12);
    return { year, month, day: 1 + rnd(daysInMonthOf(year, month)), hour: rnd(24), minute: rnd(60), second: rnd(60) };
  };
  for (let i = 0; i < 20000; i++) {
    // 一半样本让两端落在月末附近，专打边界
    let a = randPoint(), b = randPoint();
    if (i % 2) { a.day = daysInMonthOf(a.year, a.month) - rnd(3); b.day = Math.min(b.day, 1 + rnd(3)); }
    const d = diffPoints(a, b);
    for (const [k, max] of [['months', 11], ['hours', 23], ['minutes', 59], ['seconds', 59]]) {
      assert.ok(d[k] >= 0 && d[k] <= max, `${k} 越界：${S(a)} → ${S(b)} 得 ${JSON.stringify(d)}`);
    }
    assert.ok(d.years >= 0 && d.days >= 0 && d.days <= 30, `${S(a)} → ${S(b)} 得 ${JSON.stringify(d)}`);
    const [from, to] = d.negative ? [b, a] : [a, b];
    const back = addDuration(from, { years: d.years, months: d.months, days: d.days, hours: d.hours,
                                     minutes: d.minutes, seconds: d.seconds, sleepCycles: 0 }, 1);
    assert.equal(S(back), S(to), `互逆失败：${S(from)} + ${formatDiffText(d)} ≠ ${S(to)}`);
    assert.equal(Math.abs(d.totalMs), Math.abs(pointToMs(b) - pointToMs(a)));
  }
});

test('addMonthsClamped 跨年进退位', () => {
  assert.equal(S(addMonthsClamped(P('2026-12-15'), 1)), '2027-01-15 00:00:00');
  assert.equal(S(addMonthsClamped(P('2026-01-15'), -1)), '2025-12-15 00:00:00');
  assert.equal(S(addMonthsClamped(P('2026-01-15'), -25)), '2023-12-15 00:00:00');
});
