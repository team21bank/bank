import React, { useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { QuestionView } from "./QuestionView";

export function QuestionList({
    questions
}:
{
    questions: QuizQuestion[];
}): JSX.Element {

    const [currQuestionIndex, setCurrQuestionIndex] = useState<number>(0);

    function moveToNextQuestion(): void {
        if (currQuestionIndex < questions.length-1) {
            setCurrQuestionIndex(currQuestionIndex + 1);
        }
        if (currQuestionIndex === questions.length) {
            <h6>Congrats! You have finished the quiz!</h6>
        }
    }

    function finishedQuiz(): void {
        
    }


    return (
        <Stack gap={3}>
            <h5 key={questions[currQuestionIndex].name}>
                    <QuestionView
                        question={questions[currQuestionIndex]} //question at the index
                    ></QuestionView>
                    <Button onClick={moveToNextQuestion}>Next Question</Button>
                    {/* Button that updates useState index for moving to next question */}
                </h5>
        </Stack>
    );
}