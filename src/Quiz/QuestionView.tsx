import { QuizQuestion } from "../Interfaces/QuizQuestion";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

type ChangeEvent = React.ChangeEvent<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
>;

export function QuestionView({
    question,
    showPublished
}:
{
    question: QuizQuestion;
    showPublished: boolean;
}): JSX.Element {
    const [givenAnswer, setGivenAnswer] = useState<string>("");
    const [choice, setChoice] = useState<string>(question.options[0]);
    const defaultChoice = question.options[0];

    const OPTIONS = question.options;

    function compareAnswer(event: ChangeEvent) {
        setGivenAnswer(event.target.value);
    }

    function answerMatch(event: ChangeEvent) {
        setChoice(event.target.value);
    }

    function clearAnswerMC() {
        setChoice(question.options[0]);
    }

    return !question.published || showPublished ? (
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
                                <div>
                                    <Button onClick={clearAnswerMC}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                    </div>
                </h6>
            </div>
        </div>
    ) : (
        <div></div>
    );
}