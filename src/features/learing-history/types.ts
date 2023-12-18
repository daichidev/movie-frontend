// TODO 仕様確定次第反映
export type LearningAction =
  | 'genre_select'
  | 'movie_select'
  | 'movie_play'
  | 'movie_pause'
  | 'movie_resume'
  | 'movie_end'
  | 'stamp_put'
  | 'stamp_delete'
  | 'stamp_view'
  | 'toibox_question_edit'
  | 'toibox_question_edit_save'
  | 'toibox_question_edit_cancel'
  | 'toibox_question_reset'
  | 'toibox_answer_write'
  | 'toibox_answer_clear'
  | 'toibox_answer_save';

export type LearningHistoryDetails = {
  genre_select: {
    user_type: UserType;
    genre: string;
  };
  movie_select: {
    user_type: UserType;
    genre: string;
    movie_id: string;
  };
  movie_play: {
    user_type: UserType;
    genre: string;
    movie_id: string;
  };
  movie_pause: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    pause_at: number;
  };
  movie_resume: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    resume_at: number;
  };
  movie_end: {
    user_type: UserType;
    genre: string;
    movie_id: string;
  };
  stamp_put: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    stamp_type: number;
    stamp_at: number;
  };
  stamp_view: {
    user_type: UserType;
    genre: string;
    movie_id: string;
  };
  stamp_delete: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    stamp_type: number;
    stamp_at: number;
  };
  toibox_question_edit: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    question: string;
  };
  toibox_question_edit_save: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    question: string;
  };
  toibox_question_edit_cancel: {
    user_type: UserType;
    genre: string;
    movie_id: string;
  };
  toibox_question_reset: {
    user_type: UserType;
    genre: string;
    movie_id: string;
  };
  toibox_answer_write: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    question: string;
  };
  toibox_answer_clear: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    input_type: 'touch';
    question: string;
  };
  toibox_answer_save: {
    user_type: UserType;
    genre: string;
    movie_id: string;
    input_type: InputType;
    question: string;
    answer: string;
    stroke: any[];
  };
};

export type UserType =
  | 1 // 児童
  | 2 //　教師
  | 9; // その他

export type TransitionSource = any;

export type InputType = 'touch' | 'keyboard';

export const STAMPS = {
  normal: 1,
  good: 2,
  best: 3,
};
