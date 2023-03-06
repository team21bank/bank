import { getDatabase, onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BankContext } from "../Authentication/auth";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import { Quiz } from "../Interfaces/Quiz";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { ImportQuiz } from "./ImportQuiz";
import quizzes from "./quizData.json";
import { QuizList } from "./QuizList";

//make an import JSON feature
export function StudentQuizMain(): JSX.Element{
    
    const bank_context = useContext(BankContext);
    const current_bank: Bank = bank_context.bank ? bank_context.bank : DEFAULT_BANK;

    return(
        <h3>
        <QuizList
            quizzes={quizzes}
        ></QuizList>
    </h3>
    
    );
}

