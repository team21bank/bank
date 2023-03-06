import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BankContext } from "../Authentication/auth";
import { Quiz } from "../Interfaces/Quiz";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { ImportQuiz } from "./ImportQuiz";
import quizzes from "./quizData.json";
import { QuizList } from "./QuizList";

const allQuizzes = quizzes.map((myquiz): Quiz => ({ ...myquiz}));

//make an import JSON feature
export function QuizPage(): JSX.Element{

    const bank_context = useContext(BankContext);

    const [quizzes, setQuizzes] = useState<Quiz[]>(allQuizzes);

    //temporary function for testing purposes, with uploading quizzes from csv
    function addQuiz(newQuiz: Quiz){
        setQuizzes([...quizzes, newQuiz]);
    }

    return(
        <h3>
        <QuizList
            classCode={classCode}
            quizzes={quizzes}
        ></QuizList>
        {/*<ImportQuiz addQuiz={addQuiz} classCode = {bank_context.bank ? bank_context.bank.bankId : ""}></ImportQuiz>*/}
    </h3>
    
    );
}


