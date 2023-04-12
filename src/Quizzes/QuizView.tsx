import { Quiz } from "../Interfaces/Quiz";
import React from "react";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { QuestionList } from "./QuestionList";

export function QuizView({
    quiz,
    classCode
}:
{
    quiz: Quiz;
    classCode: string
}): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const [myPoints, setMyPoints] = useState<number>(0);

    function viewQuiz(): void {
        setVisible(!visible);
    }

    function addPoints(pointsAdded: number) {
        setMyPoints(myPoints + pointsAdded);
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
                            classCode={classCode}
                            questions={quiz.questions}
                            id={quiz.id}
                            viewQuiz={viewQuiz}
                            //addPoints={addPoints}
                        ></QuestionList>
                    </div>
                ) : (
                    <Col></Col>
                )}
            </div>
        </div>
    );
}