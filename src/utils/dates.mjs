/** Whole calendar years since a UTC date, including the month/day anniversary. */
export function wholeYearsSince(start, now = new Date()) {
  const date = new Date(`${start}T00:00:00Z`);
  if (!Number.isFinite(date.valueOf()) || !Number.isFinite(now.valueOf()))
    return 0;
  const beforeAnniversary =
    now.getUTCMonth() < date.getUTCMonth() ||
    (now.getUTCMonth() === date.getUTCMonth() &&
      now.getUTCDate() < date.getUTCDate());
  return Math.max(
    0,
    now.getUTCFullYear() - date.getUTCFullYear() - Number(beforeAnniversary)
  );
}

export function monthYear(date) {
  const isoDate = date.length === 7 ? `${date}-01` : date;
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
