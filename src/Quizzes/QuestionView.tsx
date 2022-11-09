import { QuizQuestion } from "../Interfaces/QuizQuestion";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

type ChangeEvent = React.ChangeEvent<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
>;

export function QuestionView({
    question
}:
{
    question: QuizQuestion;
}): JSX.Element {
    const [choice, setChoice] = useState<string>(question.options[0]);
    const defaultChoice = question.options[0];

    const OPTIONS = question.options;

    function answerMatch(event: ChangeEvent) {
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
                                            onChange={answerMatch}
                                        >
                                            {OPTIONS.map((item: string) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <option>Your answer is: </option>
                                    {choice === question.expected ? "✔️" : "❌"}
                                </div>
                            </div>
                    </div>
                </h6>
            </div>
        </div>
   );
}