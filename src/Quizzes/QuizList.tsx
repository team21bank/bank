import React from "react";
import { Stack } from "react-bootstrap";
import { Quiz } from "../Interfaces/Quiz";
import { QuizView } from "../Quizzes/QuizView";

export function QuizList({
    quizzes,
    classCode
}: {
    quizzes: Quiz[];
    classCode: string;
}): JSX.Element {
    return (
        <Stack gap={3}>
            {quizzes.map((quiz: Quiz) => (
                <div key={quiz.title} className="bg-light border m-2 p-2">
                    <QuizView classCode={classCode} quiz={quiz}></QuizView>
                </div>
            ))}
        </Stack>
    );
}