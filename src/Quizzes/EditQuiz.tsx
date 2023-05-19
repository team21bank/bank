import { Container, Form, InputGroup, Accordion, Row, Button, Table, Modal, Col, Image } from "react-bootstrap";
import { Quiz } from "../Interfaces/Quiz";
import { default_quizquestion, QuizQuestion } from "../Interfaces/QuizQuestion";
import { useContext, useState } from "react";
import { BsTrash } from "react-icons/bs";
import "./EditQuiz.css";
import { delete_quiz } from "../DatabaseFunctions/QuizFunctions";
import { update_auth_user } from "../DatabaseFunctions/UserFunctions";
import { AuthContext } from "../Authentication/auth";


export function EditQuizModal(
    {quiz, save}:
    {quiz: Quiz, save: (new_quiz: Quiz)=>void}
): JSX.Element {
    const [show, set_show] = useState(false);

    //have to perform a deep copy
    const [new_quiz, set_new_quiz] = useState(JSON.parse(JSON.stringify(quiz)))

    const user = useContext(AuthContext).user;

    return (
        <div>
            <Modal show={show} size="lg">
                <Modal.Header><h1>Edit Quiz</h1></Modal.Header>
                <Modal.Body>
                    <EditForm quiz={new_quiz} set_quiz={set_new_quiz}/>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Button
                            variant="danger"
                            onClick={() => {
                                delete_quiz(quiz.hash);
                                update_auth_user(user.hash, {...user, quizzes: user.quizzes.filter(q => q!==quiz.hash)});
                            }}
                        >Delete Quiz</Button>
                    </Col>
                    <Button onClick={()=>{//save quiz to database and hide modal
                        save(new_quiz);
                        set_show(false);
                    }}>save</Button>
                    <Button onClick={()=>{//reset quiz to original value and hide modal
                        set_new_quiz(JSON.parse(JSON.stringify(quiz)));
                        set_show(false);
                    }}>cancel</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={()=>set_show(true)}>Edit Quiz</Button>
        </div>
    )
}

export function EditForm({quiz, set_quiz}: {quiz: Quiz, set_quiz: (q: Quiz) => void}): JSX.Element {
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
            <Form className="form-group"> {/* Form to control quiz name, description, and value */}
                <h3>Quiz info</h3>
                <InputGroup size="lg" className="quiz-input-field">
                    <InputGroup.Text className="quiz-input-text">Quiz name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        value={quiz.title}
                        onChange={e => set_quiz({...quiz, title: e.target.value})}
                    />
                </InputGroup>
                <InputGroup size="lg" className="quiz-input-field">
                    <InputGroup.Text className="quiz-input-text">Quiz description</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        type="text"
                        value={quiz.description}
                        onChange={e => set_quiz({...quiz, description: e.target.value})}
                    />
                </InputGroup>
                <InputGroup size="lg" className="quiz-input-field">
                    <InputGroup.Text className="quiz-input-text">Points</InputGroup.Text>
                    <Form.Control
                        type="number"
                        value={quiz.money}
                        onChange={e => set_quiz({...quiz, money: (isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))})}
                    />
                </InputGroup>
            </Form>
            <br/>
            <Form className="form-group"> {/* Form to configure the number of allowed quiz attempts */}
                <h3>Number of attempts</h3>
                <InputGroup size="lg" className="quiz-input-field">
                    <InputGroup.Text className="quiz-input-text">Default</InputGroup.Text>
                    <Form.Control
                        type="number"
                        value={quiz.allowed_attempts[0]}
                        onChange={e => set_quiz({...quiz, allowed_attempts: [(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)), quiz.allowed_attempts[1], quiz.allowed_attempts[2], quiz.allowed_attempts[3]]})}
                    />
                </InputGroup>
                <InputGroup size="lg" className="quiz-input-field">
                    <InputGroup.Text className="quiz-input-text">Apprentices</InputGroup.Text>
                    <Form.Control
                        type="number"
                        value={quiz.allowed_attempts[1]}
                        onChange={e => set_quiz({...quiz, allowed_attempts: [quiz.allowed_attempts[0], (isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)), quiz.allowed_attempts[2], quiz.allowed_attempts[3]]})}
                    />
                </InputGroup>
                <InputGroup size="lg" className="quiz-input-field">
                    <InputGroup.Text className="quiz-input-text">Journeymen</InputGroup.Text>
                    <Form.Control
                        type="number"
                        value={quiz.allowed_attempts[2]}
                        onChange={e => set_quiz({...quiz, allowed_attempts: [quiz.allowed_attempts[0], quiz.allowed_attempts[1], (isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)), quiz.allowed_attempts[3]]})}
                    />
                </InputGroup>
                <InputGroup size="lg" className="quiz-input-field">
                    <InputGroup.Text className="quiz-input-text">Masters</InputGroup.Text>
                    <Form.Control
                        type="number"
                        value={quiz.allowed_attempts[3]}
                        onChange={e => set_quiz({...quiz, allowed_attempts: [quiz.allowed_attempts[0], quiz.allowed_attempts[1], quiz.allowed_attempts[2], (isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))]})}
                    />
                </InputGroup>
            </Form>
            <br/>
            <div className="form-group">
                <h3>Questions</h3>
                <Accordion style={{justifyContent: "center"}}>
                    {quiz.questions.map((question, index) => <QuestionForm key={index} question={question} set_question={(q)=>set_question_at_index(index, q)} index={index}/>)}
                    <Accordion.Item eventKey="add-question-button">
                        <Row style={{marginInline: "0"}}>
                            <Button onClick={add_question}>Add question</Button>
                        </Row>
                    </Accordion.Item>
                </Accordion>
            </div>
        </Container>
    )
}

function QuestionForm({question, set_question, index}: {question: QuizQuestion, set_question: (q: QuizQuestion | null)=>void, index: number}): JSX.Element {
    const set_options = (new_options: [string, boolean][]) => {
        set_question({...question, options: new_options});
    }

    return(
        <Accordion.Item eventKey={String(index)}>
            <Accordion.Header><h3>Question {index+1}: {question.name}</h3></Accordion.Header>
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
                    <InputGroup size="lg">
                        <InputGroup.Text>Image URL</InputGroup.Text>
                        <Form.Control
                            type="url"
                            value={question.picture_url}
                            onChange={e => set_question({...question, picture_url: e.target.value})}
                            placeholder=""
                        />
                    </InputGroup>
                    <Image thumbnail src={question.picture_url} style={{maxHeight: "200px"}}/>
                    <OptionsTable options={question.options} set_options={set_options}/>
                </Form>
                <Button variant="danger" onClick={()=>set_question(null)}>Delete Question<BsTrash/></Button>
            </Accordion.Body>
        </Accordion.Item>
    )
}

function OptionsTable({options, set_options}: {options: [string, boolean][], set_options: (o: [string, boolean][])=>void}): JSX.Element {
    function set_option_at_index(index, new_option: [string, boolean] | null) {
        if(new_option===null) {
            set_options(options.filter((opt, ind)=>ind!==index))
        } else {
            set_options(options.map((opt, ind) => {
                return (ind===index ? new_option : opt)
            }))
        }
    }

    return (
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Correct?</th>
                    <th>Answer Text</th>
                    <th></th>
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
                        <td>
                            <Button variant="danger" onClick={()=>set_option_at_index(ind, null)}><BsTrash/></Button>
                        </td>
                    </tr>
                })}
                <tr><td><Button onClick={() => set_options([...options, ["", false]])}>Add Option</Button></td></tr>
            </tbody>
        </Table>
    )
}