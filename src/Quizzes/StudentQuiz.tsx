import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Bank } from "../Interfaces/BankObject";
import { Quiz } from "../Interfaces/Quiz";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { ImportQuiz } from "./ImportQuiz";
import quizzes from "./quizData.json";
import { QuizList } from "./QuizList";

//make an import JSON feature
export function StudentQuizMain({classCode}:{classCode:string}): JSX.Element{
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [currClass, setCurrClass] = useState<Bank>({
        bankId:'',
        teacherID:'',
        studentList:[],
        classTitle:'',
        quizzes:[],
    });
    
    useEffect(() => {
        onValue(ref(getDatabase(),"/groups/"+classCode.slice(0,6)+"/bankObj"),ss=>{
            if(currClass !== ss.val()) {
                setCurrClass(ss.val());
            }
        })
    }, [classCode, currClass]);

    useEffect(()=>setQuizzes(currClass.quizzes),[currClass.quizzes]);
    

    return(
        <h3>
        <QuizList
            quizzes={quizzes}
        ></QuizList>
    </h3>
    
    );
}

