import { apiClientInstance } from '../../utils/auth/helpers/apiClient/instance';
import { formatHistoricalDate } from '../../utils/date';
import { LEARNING_HISTORY_API_KEY } from '../../utils/env';
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
  detail: LearningHistoryDetails[A],
) => {
  const data: LearningHistoryPostRequest = {
    user_uuid,
    historical_date: formatHistoricalDate(new Date()),
    action,
    detail,
  };
  const res = await apiClientInstance({
    url: '/apps/api/learning-history/Prod/movie',
    method: 'post',
    data,
    headers: {
      Authorization: `Bearer ${LEARNING_HISTORY_API_KEY}`,
    },
  });
  return res.data;
};
