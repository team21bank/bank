import { useContext, useEffect, useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";
import { AuthContext, BankContext } from "../../Authentication/auth";
import { get_quizzes } from "../../DatabaseFunctions/QuizFunctions";
import { Quiz } from "../../Interfaces/Quiz";
import { EditQuizModal } from "../../Quizzes/EditQuiz";
import { Bank } from "../../Interfaces/BankObject";
import { update_bank } from "../../DatabaseFunctions/BankFunctions";


export function AssignQuizzesModal(): JSX.Element {
    const bank = useContext(BankContext).bank;
    const user = useContext(AuthContext).user;

    const [quizzes, set_quizzes] = useState<Quiz[]>([]);
    useEffect(() => {
        get_quizzes(user.quizzes).then((quizz) => set_quizzes(quizz))
    }, [user])

    const [show, set_show] = useState(false);

    return (
        <div>
            <Modal show={show} onHide={()=>set_show(false)} size="lg">
                <Modal.Header closeButton><h3>Assign Quizzes</h3></Modal.Header>
                <Modal.Body>
                    {quizzes.map((q, index) => <QuizCard key={index} quiz={q} bank={bank}/>)}
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
            <Button onClick={()=>set_show(true)}>Assign Quizzes</Button>
        </div>
    )
}


function QuizCard({quiz, bank}: {quiz: Quiz, bank: Bank}): JSX.Element {
    return (
        <Card className="quiz-card">
            <Card.Header><h3>{quiz.title}</h3></Card.Header>
            <Card.Body>
                <div>{quiz.description}</div>
                <div>{quiz.questions.length} questions</div>
            </Card.Body>
            <Card.Footer>
                <Form.Check 
                    type="switch"
                    checked={bank.quizzes.find(id => id===quiz.hash)===undefined ? false : true}
                    onChange={e => {
                        if(e.target.checked===true) {
                            update_bank(bank.bankId, {...bank, quizzes: [...bank.quizzes, quiz.hash]})
                        } else {
                            update_bank(bank.bankId, {...bank, quizzes: bank.quizzes.filter(id=>id!==quiz.hash)})
                        }
                    }}
                />
            </Card.Footer>
        </Card>
    )
}