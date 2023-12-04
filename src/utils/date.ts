import { format } from 'date-fns';

// ref: https://date-fns.org/v2.16.1/docs/format

export const formatHistoricalDate = (date: Date) =>
  format(date, 'yyyy-MM-ddTHH:mm:ss.xxx');
