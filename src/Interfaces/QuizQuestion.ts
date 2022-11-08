import { QuestionType } from "./QuestionType";

export interface QuizQuestion{
    id: number; //unique id for the question; useful for deleting questions

    name: string; //question title

    body: string; //more details about the question

    points: number; //question points

    type: string; //only MultipleChoice

    options: string[]; //options exist if MultipleChoice type

    expected: string; //correct answer

    published: boolean; //whether question has been published or not
}
