import { Quiz } from "../Interfaces/Quiz";
import React from "react";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { QuestionList } from "./QuestionList";

export function QuizView({
    quiz
}:
{
    quiz: Quiz;
}): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);

    function viewQuiz(): void {
        setVisible(!visible);
    }

    return (
        <div>
            <p>{quiz.title}</p>
            <h4>{"Total Questions: " + quiz.questionTotal}</h4>
            <h6>{quiz.description}</h6>
            <div>
                <Button onClick={viewQuiz}>Open/Close</Button>
            </div>
            <Row>
            </Row>
            <div>
                {visible ? (
                    <div>
                        <QuestionList
                            questions={quiz.questions}
                        ></QuestionList>
                    </div>
                ) : (
                    <Col></Col>
                )}
            </div>
        </div>
    );
}