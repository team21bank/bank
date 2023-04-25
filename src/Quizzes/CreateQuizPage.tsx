import React, { useState } from "react";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import "./CreateQuizPage.css";
import { Quiz, default_quiz } from "../Interfaces/Quiz";
import { QuizQuestion, default_quizquestion } from "../Interfaces/QuizQuestion";

export function CreateQuizPage(): JSX.Element {
    const [new_quiz, set_new_quiz] = useState<Quiz>(default_quiz())

    return (
        <Container fluid className="create-quiz-page">
            <Row><h1>Create Quiz</h1></Row>
            <Row><CreateQuizForm quiz={new_quiz} set_quiz={set_new_quiz}/></Row>
            <Col style={{marginTop: "3rem"}}>
                <Button variant="danger">cancel</Button>
                <Button variant="success">save</Button>
            </Col>
        </Container>
    )
}

function CreateQuizForm({quiz, set_quiz}: {quiz: Quiz, set_quiz: (q: Quiz) => void}): JSX.Element {
    const add_question = () => {
        set_quiz({...quiz, questions: [...quiz.questions, default_quizquestion()]})
    }
    const set_question_at_index = (index: number, new_question: QuizQuestion | null) => {
        
    }

    return (
        <Container>
            <Accordion style={{justifyContent: "center"}}>
                {quiz.questions.map((question, index) => <QuestionForm question={question} set_question={(q)=>set_question_at_index(index, q)} index={index}/>)}
                <Accordion.Item eventKey="add-question-button">
                    <Row fluid style={{marginInline: "0"}}>
                        <Button onClick={add_question}>Add question</Button>
                    </Row>
                </Accordion.Item>
            </Accordion>
        </Container>
    )
}

function QuestionForm({question, set_question, index}: {question: QuizQuestion, set_question: (q)=>void, index: number}): JSX.Element {
    return(
        <Accordion.Item eventKey={String(index)}>
            <Accordion.Header>question {index}</Accordion.Header>
            <Accordion.Body>very cool question {index}</Accordion.Body>
        </Accordion.Item>
    )
}