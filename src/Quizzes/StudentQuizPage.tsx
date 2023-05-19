import React, { useContext, useEffect, useState } from "react";
import { AuthContext, BankContext } from "../Authentication/auth";
import { Quiz } from "../Interfaces/Quiz";
import { get_quizzes } from "../DatabaseFunctions/QuizFunctions";
import { Alert, Button, Card, Col, Container, Form, Image, Pagination, Row } from "react-bootstrap";
import "./StudentQuizPage.css";
import { BankUser, DEFAULT_BANK_USER } from "../Interfaces/BankUser";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiCheck } from "react-icons/hi";
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { Link } from "react-router-dom";
import { update_bank_user } from "../DatabaseFunctions/BankUserFunctions";
import { Bank } from "../Interfaces/BankObject";
import { push_transaction_to_completed } from "../DatabaseFunctions/BankFunctions";
import { makeSystemToStudentTransaction } from "../Interfaces/Transaction";
import { default_quizresult } from "../Interfaces/QuizResult";
import { AuthUser } from "../Interfaces/AuthUser";


//make an import JSON feature
export function StudentQuizPage(): JSX.Element{
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;

    const [quizzes, set_quizzes] = useState<Quiz[]>([]);

    const [selected_quiz, set_selected_quiz] = useState<Quiz | null>(null)

    useEffect(() => {
        get_quizzes(bank.quizzes).then((quizz) => {
            set_quizzes(quizz)
        });
    }, [bank]);

    return selected_quiz===null ? (
        <QuizList quizzes={quizzes} set_selected_quiz={set_selected_quiz}/>
    ) : (
        <TakingQuiz quiz={selected_quiz} close_quiz={() => set_selected_quiz(null)}/>
    )
}

function QuizList({quizzes, set_selected_quiz}: {quizzes: Quiz[], set_selected_quiz: (q: Quiz | null)=>void}): JSX.Element {
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;
    const bank_user = bank.studentList.find(val => val.uid === user.hash) ?? DEFAULT_BANK_USER;

    //I know this is stupid, I just dont want to think right now
    const finished_quizzes: Quiz[] = quizzes.filter(q => bank_user.finishedQuizzes.find(f => f.quiz===q.hash) !== undefined);
    const unfinished_quizzes: Quiz[] = quizzes.filter(q => bank_user.finishedQuizzes.find(f => f.quiz===q.hash) === undefined);

    return (
        <Container fluid className="quiz-lists-container">
            <Row>
                <Col className="unfinished-quiz-container">
                    <h3>Unfinished Quizzes</h3>
                    {unfinished_quizzes.map((q, index) => <UnfinishedQuizCard quiz={q} key={index} select={()=>set_selected_quiz(q)}/>)}
                </Col>
                <Col className="finished-quiz-container">
                    <h3>Finished Quizzes</h3>
                    {finished_quizzes.map((q, index) => <FinishedQuizCard quiz={q} key={index} select={()=>set_selected_quiz(q)}/>)}
                </Col>
            </Row>
        </Container>
    )
}

function FinishedQuizCard({quiz, select}: {quiz: Quiz, select: ()=>void}): JSX.Element {
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;
    const bank_user = bank.studentList.find(val => val.uid === user.hash) ?? DEFAULT_BANK_USER;

    const quiz_result = bank_user.finishedQuizzes.find(r => r.quiz === quiz.hash) ?? default_quizresult();
    const can_take = quiz.allowed_attempts[bank_user.role[1]] > quiz_result.attempts.length;
    const attempts_left = quiz.allowed_attempts[bank_user.role[1]] - quiz_result.attempts.length;

    console.log("allowed attempts: ", quiz.allowed_attempts[bank_user.role[1]])

    return (
        <Card className="finished-quiz-card">
            <Card.Header><h5>{quiz.title}</h5></Card.Header>
            <Card.Body>
                <div>{quiz.description}</div>
                <div className="num-questions-tag">{quiz.questions.length} questions</div>
                <div>{attempts_left} attempts remaining</div>
            </Card.Body>
            {can_take ? (
                <Card.Footer>
                    <Button onClick={select}>Retake Quiz</Button>
                </Card.Footer>
            ) : <></> }
        </Card>
    )
}
function UnfinishedQuizCard({quiz, select}: {quiz: Quiz, select: ()=>void}): JSX.Element {
    return (
        <Card className="unfinished-quiz-card">
            <Card.Header><h5>{quiz.title}</h5></Card.Header>
            <Card.Body>
                <div>{quiz.description}</div>
                <div className="num-questions-tag">{quiz.questions.length} questions</div>
            </Card.Body>
            <Card.Footer>
                <Button onClick={select}>Take Quiz</Button>
            </Card.Footer>
        </Card>
    )
}

//This is uper ugly and I need to change it eventually
function TakingQuiz({quiz, close_quiz}: {quiz: Quiz, close_quiz: ()=>void}): JSX.Element {
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;

    //this stuff is just total junk to put if the completed quiz alert
    //I've been coding for like 6 hours so I cant think of a better way to do this right now
    const [submitted, set_submitted] = useState(false);
    const [total_right, set_total_right] = useState(0);
    const [total_earned, set_total_earned] = useState(0);
    function submit() {
        let total = 0;
        answer_arr.forEach(b => {if(b){total+=1}});
        set_total_right(total);

        //Just scales the amount of money given based off what percentage of answers were correct
        const money = Math.floor(quiz.money * (answer_arr.length===0 ? 1 : total/answer_arr.length));
        set_total_earned(money);
        
        submit_quiz(user, bank, user.hash, quiz, answer_arr as boolean[]).then(() => {
            set_submitted(true);
        });
    }

    let [question_index, set_question_index] = useState(0);
    function increment() {
        if(question_index<(quiz.questions.length-1)) {set_question_index(question_index+1)}
    }
    function decrement() {
        if(question_index>0) {set_question_index(question_index-1)}
    }

    //indexes into the options array for each question
    let [answer_arr, set_answer_arr] = useState<(boolean | null)[]>(quiz.questions.map(_=>null));
    function set_answer_at_index(index: number, correct: boolean) {
        set_answer_arr(answer_arr.map((a, ind) => ind===index ? correct : a));
    }

    return submitted ? (
        <Alert style={{textAlign: "center"}}>
            <h1>Quiz Submitted</h1>
            <br/>
            <h3>{total_right} out of {answer_arr.length} questions correct. You earned ${total_earned}</h3>
            <br/>
            <Button size="lg" onClick={close_quiz}>Back To Quizzes</Button>
        </Alert>
    ) : (
        <Container fluid className="taking-quiz-container">
            <h2 style={{textAlign: "center"}}>Taking quiz: {quiz.title}</h2>
            <Pagination>
                {quiz.questions.map((_, index) => <Pagination.Item active={question_index===index} key={index}>{index+1}</Pagination.Item>)}
            </Pagination>
            <DisplayQuestions questions={quiz.questions} set_answer={set_answer_at_index} index={question_index}/>
            <Row style={{marginTop: "2em"}}>
                <Col style={{textAlign: "left"}}><Button size="lg" onClick={decrement}><HiOutlineArrowLeft/>Previous Question</Button></Col>
                <Col style={{textAlign: "right"}}>
                    {question_index>=(quiz.questions.length-1) ? (
                        answer_arr.includes(null) ? (
                            <Button variant="danger" disabled={true} size="lg">Answer All Questions First!</Button>
                        ) : (
                            <Button variant="success" size="lg" onClick={submit}>Submit<HiCheck/></Button>
                        )
                    ) : (
                        <Button size="lg" onClick={increment}>Next Question<HiOutlineArrowRight/></Button>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

function DisplayQuestions({questions, set_answer, index}: {questions: QuizQuestion[], set_answer: (index: number, b: boolean)=>void, index: number}): JSX.Element {
    const [selected, set_selected] = useState<number[]>(questions.map(_=>-1));
    function select(ind: number) {
        set_answer(index, questions[index].options[ind][1]);
        set_selected(selected.map((s, i) => i===index ? ind : s));
    }

    if(questions.length===0) {return <div></div>}

    const question = questions[index];

    return (
        <Container className="question-container">
            <h2>{question.name}</h2>
            <br/>
            <h5>{question.body}</h5>
            {question.picture_url==="" ? <></> : (
                <Image fluid src={question.picture_url}></Image>
            )}
            <br/>
            {question.options.map(([option, _], i) => 
                <Form.Check
                    className="radio-option"
                    key={i}
                    id={String(i)}
                    type="radio"
                    checked={i===selected[index]}
                    label={option}
                    onChange={e => select(parseInt(e.target.id))}
                />
            )}
        </Container>
    )
}


function submit_quiz(
    user: AuthUser, 
    bank: Bank, uid: string, quiz: Quiz, answer_arr: boolean[]): Promise<void> {
    let total = 0;
    answer_arr.forEach(b => {if(b){total+=1}});

    //Just scales the amount of money given based off what percentage of answers were correct
    const money = quiz.money * (answer_arr.length===0 ? 1 : total/answer_arr.length);

    const bank_user = bank.studentList.find(val => val.uid === uid);
    if(bank_user===undefined) {return Promise.reject("Error submitting quiz")}
    //Hooked up to transactions in the database; Rounds money to be consistent with what we do when students pay eachother.
    roundTo(Number(money), 2)
    push_transaction_to_completed(bank.bankId, makeSystemToStudentTransaction(user, bank_user, money, "academics", "quizzes", "Earned " + money + " from taking " + quiz.title))

    //Get the quiz result for this quiz, if it doesnt exist then make a new quiz result
    const result = bank_user.finishedQuizzes.findIndex(r => r.quiz===quiz.hash);
    if(result===-1) {
        return update_bank_user(bank, bank_user.uid, {...bank_user, balance: bank_user.balance+money, finishedQuizzes: [...bank_user.finishedQuizzes, {quiz: quiz.hash, attempts: [total]}]});
    } else {
        const new_quiz_results = [...bank_user.finishedQuizzes]
        new_quiz_results.splice(result, 1, {quiz: quiz.hash, attempts: [...bank_user.finishedQuizzes[result].attempts, total]})
        return update_bank_user(bank, bank_user.uid, {...bank_user, balance: bank_user.balance+money, finishedQuizzes: new_quiz_results})
    }
}

//Originally from TransactionModel.tsx
//use this when subtracting!!!!!! See below for example on how to use to update value in db (commented out)
const roundTo = function (num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
};