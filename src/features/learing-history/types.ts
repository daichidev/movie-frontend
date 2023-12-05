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
    // TODO 仕様書:         "user_agent": "IPアドレス"
    ip_address: string;
  };
};

export type UserType =
  | 1 // 児童
  | 2 //　教師
  | 9; // その他

// TODO
export type TransitionSource = any;

// TODO enum values
export type InputType = 'touch' | 'keyboard' | 'software-keyboard';
