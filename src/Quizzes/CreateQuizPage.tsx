import React, { useContext, useEffect, useState } from "react";
import { Accordion, Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import "./CreateQuizPage.css";
import { Quiz, default_quiz } from "../Interfaces/Quiz";
import { QuizQuestion, default_quizquestion } from "../Interfaces/QuizQuestion";
import { auth } from "../firebase";
import { create_new_quiz } from "../DatabaseFunctions/QuizFunctions";
import { update_auth_user } from "../DatabaseFunctions/UserFunctions";
import { AuthContext } from "../Authentication/auth";
import { useNavigate } from "react-router-dom";
import { EditForm } from "./EditQuiz";

export function CreateQuizPage(): JSX.Element {
    //use session storage to store the quiz in case of accidental refresh?
    const navigate = useNavigate();

    const user = useContext(AuthContext).user

    async function save_quiz() {
        let code = await create_new_quiz(new_quiz);
        await update_auth_user(user.hash, {...user, quizzes: [...user.quizzes, code]});
        navigate("/teachers/quizzes")
    }

    //makes sure the quiz always has an owner
    useEffect(() => {
        if(auth.currentUser !== null){
            set_new_quiz({...new_quiz, owner: auth.currentUser.uid});
        }
    }, [auth.currentUser])

    const [new_quiz, set_new_quiz] = useState<Quiz>(default_quiz())

    return (
        <Container fluid className="create-quiz-page" style={{width: "90%"}}>
            <Row><h1>Create Quiz</h1></Row>
            <Row><EditForm quiz={new_quiz} set_quiz={set_new_quiz}/></Row>
            <Col style={{marginTop: "3rem"}}>
                <Button variant="success" onClick={()=>{
                    console.log(new_quiz);
                    save_quiz();
                }}>Save</Button>
            </Col>
        </Container>
    )
}