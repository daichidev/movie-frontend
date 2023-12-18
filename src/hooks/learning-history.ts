import {
  LearningAction,
  LearningHistoryDetails,
  UserType,
  postLearningHistory,
} from '../features/learing-history';
import { useAuthContext } from '../utils/auth/middleware/auth/AuthContext';
import { SKIP_HISTORY } from '../utils/env';

export const useLearningHistory = () => {
  const { getCurrentUser } = useAuthContext();

  const post = async <A extends LearningAction>(
    action: A,
    detail: Omit<LearningHistoryDetails[A], 'user_type'>,
  ) => {
    if (SKIP_HISTORY) return;
    const user = getCurrentUser?.() || {
      user_uuid: 'test_movie',
      user_type: 9,
    };
    if (!user) return;
    const detailWithUserType = {
      ...detail,
      user_type: user.user_type as UserType,
    } as LearningHistoryDetails[A];
    return postLearningHistory(user.user_uuid, action, detailWithUserType);
  };

  return { post };
};
