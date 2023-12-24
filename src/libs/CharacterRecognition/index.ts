import { CHARACTER_RECOGNITION_API_URL } from '../../utils/env';

type StrokePoint = [number, number];
type Stroke = StrokePoint[];

/** 0:Auto(Default)/1:横書き/2:縦書き */
type TextDirectionMode = 0 | 1 | 2;

type CharacterRecognitionRequest = {
  strokes: Stroke[];
  text_direction_mode?: TextDirectionMode;
};

type CharacterRecognitionResponse = { recognition: string };

export const postCharacterRecognition = async (
  data: CharacterRecognitionRequest,
): Promise<CharacterRecognitionResponse | undefined> => {
  const res = await fetch(CHARACTER_RECOGNITION_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (res.status !== 200) {
    console.error(res);
    return;
  }
  const body = await res.json();
  if ('error' in body) {
    console.error(body);
    return;
  }
  return body;
};
