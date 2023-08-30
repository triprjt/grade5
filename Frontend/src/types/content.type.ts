export type IContentType = "text" | "image" | "video" | "mcq";

export interface IContent {
  type: IContentType;
  body: IBody;
}

export interface IBody {
  id: number;
  text?: string;
  is_completed: boolean;
  user?: number;
  image?: string[];
  video?: string;
  questions?: IQuestion[];
}

export interface IQuestion {
  id: number;
  question_title: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correct_choice: number;
  mcq_set: number;
}
