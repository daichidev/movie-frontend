// TODO 仕様確定次第反映
export type LearningAction = 'login';
// | 'grade_select'
// | 'movie_select'
// | 'movie_play'
// | 'movie_pause'
// | 'stamp_click'
// | 'stamp_check_mine'
// | 'stamp_check_class_all'
// | 'stamp_check_class'
// | 'stamp_remove'
// | 'toibox_write'
// | 'toibox_record'
// | 'toibox_change_question'
// | 'toibox_reset';

export type LearningHistoryDetails = {
  login: {
    user_type: UserType;
    transition_source: TransitionSource;
    user_agent: string;
    // note 仕様書:         "user_agent": "IPアドレス"
    ip_address: string;
  };
};

export type UserType =
  | 1 // 児童
  | 2 //　教師
  | 9; // その他

export type TransitionSource = any;

export type InputType = 'touch' | 'keyboard' | 'software-keyboard';
