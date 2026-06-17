function pickRandom(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function preferUnused(items, usedIds) {
  const unused = items.filter((item) => !usedIds.includes(item.id));
  return unused.length ? unused : items;
}

export function selectEvent(events, turn, usedIds) {
  const eligible = events.filter((event) => (event.minTurn ?? 1) <= turn);
  return pickRandom(preferUnused(eligible, usedIds));
}

export function markUsed(usedIds, event) {
  if (!event) return usedIds;
  return usedIds.includes(event.id) ? usedIds : [...usedIds, event.id];
}
