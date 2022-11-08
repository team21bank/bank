import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Quiz } from "../Interfaces/Quiz";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { Answer } from "../Interfaces/Answer";
import quizzes from "./quizData.json";
import { QuizList } from "./QuizList";

const allQuizzes = quizzes.map((myquiz): Quiz => ({ ...myquiz}));

//make an import JSON feature
export function QuizMain(): JSX.Element{
    const [quizzes, setQuizzes] = useState<Quiz[]>(allQuizzes);
    return(
        <h3>
        <QuizList
            quizzes={allQuizzes}
        ></QuizList>
    </h3>
    );
}


