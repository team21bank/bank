import React, {  useContext, useState } from "react";
import { Button,  Stack } from "react-bootstrap";
import { AuthContext, BankContext } from "../Authentication/auth";
import { DEFAULT_BANK_USER } from "../Interfaces/BankUser";
import { update_bank_user } from "../DatabaseFunctions/BankUserFunctions";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { QuestionView } from "./QuestionView";
import { DEFAULT_AUTH_USER } from "../Interfaces/AuthUser";

export function QuestionList({
    questions,
    classCode,
    id,
    viewQuiz
    //addPoints
}:
{
    questions: QuizQuestion[];
    classCode: string;
    id: number;
    viewQuiz: ()=>void;
    //addPoints: (addPoints: number)=>void;
}): JSX.Element {

    const [currQuestionIndex, setCurrQuestionIndex] = useState<number>(0);
    const [choice, setChoice] = useState<string>("Select a Choice");
    const [score, setScore] = useState<number>(0);

    let bank_context = useContext(BankContext);
    let auth_context = useContext(AuthContext);

    const current_user = auth_context.user;
    const current_bank = bank_context.bank;
    let current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash) ?? {...DEFAULT_BANK_USER};

    function moveToNextQuestion(): void {
        if (currQuestionIndex < questions.length-1) {
            setCurrQuestionIndex(currQuestionIndex + 1);
            setChoice("Select a Choice");
        }
    }

    function finishedQuiz(classCode: string) {
        //push score from here onto the database
        alert("This is broken")
        /*
        if (currQuestionIndex === questions.length-1 && current_bank_user) {
            //console.log("Test 1")
            current_bank_user.balance += score;
            if (choice === questions[currQuestionIndex].expected && !(current_bank_user.finishedQuizzes.includes(id))) {
                current_bank_user.balance += questions[currQuestionIndex].points;
            }

            //Add to finished quizzes
            if (current_bank_user.finishedQuizzes === undefined){
                current_bank_user.finishedQuizzes = [id];
            }
            else{
                current_bank_user.finishedQuizzes.push(id);
            }
            update_bank_user(classCode, current_bank_user.uid, current_bank_user);

            setScore(0);
            viewQuiz();
        }
        */
    }

    function updateScore(){
        alert("This is broken")
        /*
        if (choice === questions[currQuestionIndex].expected) {
            setScore(score + questions[currQuestionIndex].points)
        }
        */
    }

    function scoreTracker(): void{
        updateScore()
        moveToNextQuestion()
        console.log("Points updated")
    }

    return (
        <Stack gap={3}>
            <h5 key={questions[currQuestionIndex].name}>
                    <QuestionView
                        question={questions[currQuestionIndex]}
                        choice={choice}
                        setChoice={setChoice} 
                    ></QuestionView>
                    <Button onClick={scoreTracker} disabled={currQuestionIndex===questions.length-1 ? true : false} hidden={currQuestionIndex===questions.length-1 ? true : false}>Next Question</Button>
                    <Button onClick={()=>finishedQuiz(classCode)} hidden={currQuestionIndex!==questions.length-1 ? true : false}>Submit Quiz</Button>
            </h5>
            <h6>Total Points Tracker: {score}</h6>
        </Stack>
    );
}