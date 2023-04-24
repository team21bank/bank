import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BankContext } from "../Authentication/auth";
import { Bank } from "../Interfaces/BankObject";
import { Quiz } from "../Interfaces/Quiz";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { ImportQuiz } from "./ImportQuiz";
import quizzes from "./quizData.json";
import { QuizList } from "./QuizList";

const allQuizzes = quizzes.map((myquiz): Quiz => ({ ...myquiz}));

//make an import JSON feature
export function QuizPage(): JSX.Element{

    const bank_context = useContext(BankContext);
    const current_bank: Bank = bank_context.bank;

    let dbquizzes = current_bank.quizzes

    return(
        <h3>
        <QuizList
            classCode={current_bank.bankId}
            quizzes={dbquizzes}
        ></QuizList>
        {<ImportQuiz classCode = {bank_context.bank ? bank_context.bank.bankId : ""}></ImportQuiz>}
    </h3>
    
    );
}


