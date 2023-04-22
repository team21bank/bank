import React, { useContext} from "react";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import { QuizList } from "./QuizList";
import { AuthContext, BankContext} from "../Authentication/auth";
import { DEFAULT_AUTH_USER } from "../Interfaces/AuthUser";

//make an import JSON feature
export function StudentQuizMain(): JSX.Element{
    
    const bank_context = useContext(BankContext);
    let auth_context = useContext(AuthContext);

    const current_bank = bank_context.bank;
    const current_user = auth_context.user;
    let current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash);
    console.log(current_bank_user?.uid)
    let dbquizzes = current_bank.quizzes
    if (current_bank_user?.finishedQuizzes === undefined){
        return(
            <div>
                <h1>Unfinished Quizzes</h1>
                <h3>
                <QuizList
                classCode={current_bank.bankId}
                quizzes={dbquizzes}
                ></QuizList>
                <h2>Finished Quizzes</h2>
            </h3>
            </div>
        )
    }
    else{
        let unfinishedQuizzes = dbquizzes.filter((quiz) => !(current_bank_user?.finishedQuizzes.includes(quiz.id)))
        let finishedQuizzes = dbquizzes.filter((quiz) => current_bank_user?.finishedQuizzes.includes(quiz.id))
        return(
            <div>
                <h1>Unfinished Quizzes</h1>
                <h3>
                    <QuizList
                    classCode={current_bank.bankId}
                    quizzes={unfinishedQuizzes}
                    ></QuizList>
                </h3>
                <h1>Finished Quizzes</h1>
                <h3>
                    <QuizList
                    classCode={current_bank.bankId}
                    quizzes={finishedQuizzes}
                    ></QuizList>
                </h3>
            </div>
            
        );
    }

    
}

