import axios from 'axios';
import { formatHistoricalDate } from '../../utils/date';
import { LEARNING_HISTORY_API_URL } from '../../utils/env';

export type LearningAction =
  | 'login'
  | 'grade_select'
  | 'movie_select'
  | 'movie_play'
  | 'movie_pause'
  | 'stamp_click'
  | 'stamp_check_mine'
  | 'stamp_check_class_all'
  | 'stamp_check_class'
  | 'stamp_remove'
  | 'toibox_write'
  | 'toibox_record'
  | 'toibox_change_question'
  | 'toibox_reset';

type LearningHistoryPostRequest = {
  user_uuid: string;
  historical_date: string;
  action: LearningAction;
  detail: any; // JSON
};

export const postLearningHistory = async (
  uuid: string,
  action: LearningAction,
  // TODO
  detail: any,
) => {
  const res = await axios.post<any, any, LearningHistoryPostRequest>(
    '/apps/api/learning-history/Prod/movie',
    {
      user_uuid: uuid,
      historical_date: formatHistoricalDate(new Date()),
      action,
      detail,
    },
    {
      baseURL: LEARNING_HISTORY_API_URL,
    },
  );
  return res.data;
};
