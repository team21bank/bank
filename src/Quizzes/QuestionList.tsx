import React, { ChangeEvent, useContext, useState } from "react";
import { Button, FormSelect, Stack } from "react-bootstrap";
import { AuthContext, AuthUser } from "../Authentication/auth";
import { BankUser } from "../Interfaces/BankUser";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { QuestionView } from "./QuestionView";

export function QuestionList({
    questions
    //addPoints
}:
{
    questions: QuizQuestion[];
    //addPoints: (addPoints: number)=>void;
}): JSX.Element {

    const [currQuestionIndex, setCurrQuestionIndex] = useState<number>(0);
    const [choice, setChoice] = useState<string>(questions[currQuestionIndex].options[0]);
    const [score, setScore] = useState<number>(0);

    function moveToNextQuestion(): void {
        if (currQuestionIndex < questions.length-1) {
            setCurrQuestionIndex(currQuestionIndex + 1);
            setChoice(questions[currQuestionIndex+1].options[0]);
        }
    }

    function finishedQuiz(): void {
        //set
        if (currQuestionIndex === questions.length) {

        }
        updateScore()
    }

    function updateScore(){
        if (choice === questions[currQuestionIndex].expected) {
            setScore(score + questions[currQuestionIndex].points)
        }
    }

    function scoreTracker(): void{
        updateScore()
        moveToNextQuestion()
        console.log("Points updated")
    }

    return (
        <Stack gap={3}>
            <h5 key={questions[currQuestionIndex].name}>
                    <QuestionView
                        question={questions[currQuestionIndex]}
                        choice={choice}
                        setChoice={setChoice} 
                    ></QuestionView>
                    <Button onClick={scoreTracker} disabled={currQuestionIndex===questions.length-1 ? true : false} hidden={currQuestionIndex===questions.length-1 ? true : false}>Next Question</Button>
                    <Button onClick={finishedQuiz} hidden={currQuestionIndex!==questions.length-1 ? true : false}>Submit Quiz</Button>
            </h5>
            <h6>Total Points Tracker: {score}</h6>
        </Stack>
    );
}