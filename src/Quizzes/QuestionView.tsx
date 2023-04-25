import { QuizQuestion } from "../Interfaces/QuizQuestion";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

type ChangeEvent = React.ChangeEvent<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
>;

export function QuestionView({
    question,
    choice,
    setChoice
}:
{
    question: QuizQuestion;
    choice: string;
    setChoice: (string) => void;
}): JSX.Element {

    const OPTIONS = question.options;

    function updateChoice(event: ChangeEvent) {
        setChoice(event.target.value);
    }

    return (
        <div>
            <h4>{question.name}</h4>
            <div>
                <h5>{question.body}</h5>
                <h6>{"Question points: " + question.points}</h6>
                <h6>
                    <div>
                            <div>
                                <div>
                                    <Form.Group controlId="userAnswers">
                                        <Form.Select
                                            value={choice}
                                            onChange={updateChoice}
                                        >
                                            {/*{["Select a Choice", ...OPTIONS].map((item: string) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}*/}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                    </div>
                </h6>
            </div>
        </div>
   );
}