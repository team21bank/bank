import { QuizQuestion } from "./QuizQuestion"

export interface Quiz{
    id: number; //use to delete

    title: string; //name of quiz

    description: string; //what quiz is on

    questionTotal: number; //how many questions in quiz

    money: number; //how much money a student earns for earning a 100% on the quiz
    
    questions: QuizQuestion[]; //the actual questions in the quiz
}

