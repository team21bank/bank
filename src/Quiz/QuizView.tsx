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
    const [editMode, setEditMode] = useState<boolean>(false);
    const [showPublished, setShowPublished] = useState<boolean>(false);

    function viewQuiz(): void {
        setVisible(!visible);
    }

    function flipEditMode(): void {
        setEditMode(!editMode);
    }

    function changePublished(): void {
        setShowPublished(!showPublished);
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
                        <Button onClick={changePublished} variant="gray">
                            Filter: Click to Show Published Questions
                        </Button>
                        <QuestionList
                            questions={quiz.questions}
                            showPublished={showPublished}
                        ></QuestionList>
                    </div>
                ) : (
                    <Col></Col>
                )}
            </div>
        </div>
    );
}