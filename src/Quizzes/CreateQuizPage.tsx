import React, { useState } from "react";
import { Accordion, Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import "./CreateQuizPage.css";
import { Quiz, default_quiz } from "../Interfaces/Quiz";
import { QuizQuestion, default_quizquestion } from "../Interfaces/QuizQuestion";

export function CreateQuizPage(): JSX.Element {
    //use session storage to store the quiz in case of accidental refresh


    const [new_quiz, set_new_quiz] = useState<Quiz>(default_quiz())

    return (
        <Container fluid className="create-quiz-page">
            <Row><h1>Create Quiz</h1></Row>
            <Row><CreateQuizForm quiz={new_quiz} set_quiz={set_new_quiz}/></Row>
            <Col style={{marginTop: "3rem"}}>
                <Button variant="danger">cancel</Button>
                <Button variant="success" onClick={()=>console.log(new_quiz)}>save</Button>
            </Col>
        </Container>
    )
}

function CreateQuizForm({quiz, set_quiz}: {quiz: Quiz, set_quiz: (q: Quiz) => void}): JSX.Element {
    const add_question = () => {
        set_quiz({...quiz, questions: [...quiz.questions, default_quizquestion()]})
    }
    const set_question_at_index = (index: number, new_question: QuizQuestion | null) => {
        if(new_question===null) {
            set_quiz({...quiz, questions: quiz.questions.filter((q, ind) => ind!==index)});
            return;
        }
        set_quiz({...quiz, questions: quiz.questions.map((q, ind) => index===ind ? new_question : q)});
    }

    return (
        <Container>
            <Form>
                <InputGroup size="lg">
                    <InputGroup.Text>Quiz name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        value={quiz.title}
                        onChange={e => set_quiz({...quiz, title: e.target.value})}
                    />
                </InputGroup>
                <InputGroup size="lg">
                    <InputGroup.Text>Quiz description</InputGroup.Text>
                    <Form.Control
                        type="text"
                        value={quiz.description}
                        onChange={e => set_quiz({...quiz, description: e.target.value})}
                    />
                </InputGroup>
                <InputGroup size="lg">
                    <InputGroup.Text>Points</InputGroup.Text>
                    <Form.Control
                        type="number"
                        value={quiz.money}
                        onChange={e => set_quiz({...quiz, money: (isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))})}
                    />
                </InputGroup>
            </Form>
            <br/>
            <Accordion style={{justifyContent: "center"}}>
                {quiz.questions.map((question, index) => <QuestionForm key={index} question={question} set_question={(q)=>set_question_at_index(index, q)} index={index}/>)}
                <Accordion.Item eventKey="add-question-button">
                    <Row style={{marginInline: "0"}}>
                        <Button onClick={add_question}>Add question</Button>
                    </Row>
                </Accordion.Item>
            </Accordion>
        </Container>
    )
}

function QuestionForm({question, set_question, index}: {question: QuizQuestion, set_question: (q: QuizQuestion)=>void, index: number}): JSX.Element {
    const set_options = (new_options: [string, boolean][]) => {
        set_question({...question, options: new_options});
    }

    return(
        <Accordion.Item eventKey={String(index)}>
            <Accordion.Header><h2>Question {index}</h2></Accordion.Header>
            <Accordion.Body>
                <Form>
                    <InputGroup size="lg">
                        <InputGroup.Text>Question</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={question.name}
                            onChange={e => set_question({...question, name: e.target.value})}
                            placeholder="Who is William Shakespeare?"
                        />
                    </InputGroup>
                    <InputGroup size="lg">
                        <InputGroup.Text>Question info</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={question.body}
                            onChange={e => set_question({...question, body: e.target.value})}
                            placeholder=""
                        />
                    </InputGroup>
                    <OptionsTable options={question.options} set_options={set_options}/>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}

function OptionsTable({options, set_options}: {options: [string, boolean][], set_options: (o: [string, boolean][])=>void}): JSX.Element {
    function set_option_at_index(index, new_option) {
        set_options(options.map((opt, ind) => {
            return (ind===index ? new_option : opt)
        }))
    }

    return (
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Correct?</th>
                    <th>Answer Text</th>
                </tr>
            </thead>
            <tbody>
                {options.map(([str, correct], ind) => {
                    return <tr key={ind}>
                        <td>
                            {/*Signify whether or not the option is correct*/}
                            <Form.Check 
                                type="checkbox"
                                checked={correct}
                                onChange={_ => set_option_at_index(ind, [str, !correct])}
                            />
                        </td>
                        <td>
                            <Form.Control
                                value={str}
                                type="text"
                                onChange={e => set_option_at_index(ind, [e.target.value, correct])}
                            />
                        </td>
                    </tr>
                })}
                <tr><td><Button onClick={() => set_options([...options, ["", false]])}>Add Option</Button></td></tr>
            </tbody>
        </Table>
    )
}