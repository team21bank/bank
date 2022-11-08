import React from "react";
import { Stack } from "react-bootstrap";
import { Quiz } from "../Interfaces/Quiz";
import { QuizView } from "../Quiz/QuizView";

export function QuizList({
    quizzes
}: {
    quizzes: Quiz[];
}): JSX.Element {
    return (
        <Stack gap={3}>
            {quizzes.map((quiz: Quiz) => (
                <div key={quiz.title} className="bg-light border m-2 p-2">
                    <QuizView quiz={quiz}></QuizView>
                </div>
            ))}
        </Stack>
    );
}