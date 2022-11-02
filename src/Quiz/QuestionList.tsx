import React from "react";
import { Stack } from "react-bootstrap";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { QuestionView } from "./QuestionView";

export function QuestionList({
    questions,
    showPublished
}:
{
    questions: QuizQuestion[];
    showPublished: boolean;
}): JSX.Element {
    return (
        <Stack gap={3}>
            {questions.map((question: QuizQuestion) => (
                <h5 key={question.name}>
                    <QuestionView
                        question={question}
                        showPublished={showPublished}
                    ></QuestionView>
                </h5>
            ))}
        </Stack>
    );
}