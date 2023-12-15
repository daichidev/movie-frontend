export const formatToHistoricalDate = (date: Date) =>
  date.toISOString().replace(/\..*/, '+00:00');
