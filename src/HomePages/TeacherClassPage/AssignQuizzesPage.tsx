import { useContext, useEffect, useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";
import { AuthContext, BankContext } from "../../Authentication/auth";
import { get_quizzes } from "../../DatabaseFunctions/QuizFunctions";
import { Quiz } from "../../Interfaces/Quiz";
import { Bank } from "../../Interfaces/BankObject";
import { update_bank } from "../../DatabaseFunctions/BankFunctions";
import "./AssignQuizzesPage.css";


export function AssignQuizzesPage(): JSX.Element {
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;

    const [quizzes, set_quizzes] = useState<Quiz[]>([]);
    useEffect(() => {
        get_quizzes(user.quizzes).then((quizz) => set_quizzes(quizz))
    }, [user])

    return (
        <div className="assign-quizzes-page">
            <h1>Assign Quizzes</h1>
            <div className="quiz-list">
                {quizzes.map((q, index) => <QuizCard key={index} quiz={q} bank={bank}/>)}
            </div>
        </div>
    )
}


function QuizCard({quiz, bank}: {quiz: Quiz, bank: Bank}): JSX.Element {
    const assigned = bank.quizzes.find(id => id===quiz.hash)===undefined ? false : true;

    return (
        <Card className="quiz-card">
            <Card.Header style={{backgroundColor: assigned ? "lightgreen" : "pink"}}><h3>{quiz.title}</h3></Card.Header>
            <Card.Body>
                <div>{quiz.description}</div>
                <div>{quiz.questions.length} questions</div>
            </Card.Body>
            <Card.Footer>
                <Form.Group style={{display: "inline-flex"}}>
                    <Form.Label>Assign Quiz:</Form.Label>
                    <Form.Check 
                        type="switch"
                        checked={assigned}
                        onChange={e => {
                            if(e.target.checked===true) {
                                update_bank(bank.bankId, {...bank, quizzes: [...bank.quizzes, quiz.hash]})
                            } else {
                                update_bank(bank.bankId, {...bank, quizzes: bank.quizzes.filter(id=>id!==quiz.hash)})
                            }
                        }}
                    />
                </Form.Group>
            </Card.Footer>
        </Card>
    )
}