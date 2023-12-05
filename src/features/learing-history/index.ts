import axios from 'axios';
import { formatHistoricalDate } from '../../utils/date';
import { LEARNING_HISTORY_API_URL } from '../../utils/env';
import { LearningAction, LearningHistoryDetails } from './types';
export * from './types';

type LearningHistoryPostRequest = {
  user_uuid: string;
  historical_date: string;
  action: LearningAction;
  detail: any; // JSON
};

export const postLearningHistory = async <A extends LearningAction>(
  user_uuid: string,
  action: A,
  // TODO
  detail: LearningHistoryDetails[A],
) => {
  const res = await axios.post<any, any, LearningHistoryPostRequest>(
    '/apps/api/learning-history/Prod/movie',
    {
      user_uuid,
      historical_date: formatHistoricalDate(new Date()),
      action,
      detail,
    },
    { baseURL: LEARNING_HISTORY_API_URL },
  );
  return res.data;
};
