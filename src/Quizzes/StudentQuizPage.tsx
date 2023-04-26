import React, { useContext, useEffect, useState } from "react";
import { AuthContext, BankContext } from "../Authentication/auth";
import { Quiz } from "../Interfaces/Quiz";
import { get_quizzes } from "../DatabaseFunctions/QuizFunctions";
import { Container } from "react-bootstrap";


//make an import JSON feature
export function StudentQuizPage(): JSX.Element{
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;

    const [quizzes, set_quizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        get_quizzes(bank.quizzes).then((quizz) => {
            set_quizzes(quizz)
        });
    }, [bank])

    return (
        <Container>
            <h1>Class quiz page</h1>
            {quizzes.map((quiz) => <div>{quiz.title}</div>)}
        </Container>
    );
}

