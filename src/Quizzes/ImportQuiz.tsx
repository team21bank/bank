import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ref, getDatabase, set } from '@firebase/database';
import { Quiz } from "../Interfaces/Quiz";  
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import { BankContext } from "../Authentication/auth";
import { AuthContext } from "../Authentication/auth";
import { create_new_quiz } from "../DatabaseFunctions/QuizFunctions";
import { update_auth_user } from "../DatabaseFunctions/UserFunctions";
import { useNavigate } from "react-router-dom";

export function ImportQuiz(/*{classCode}: {classCode: string}*/): JSX.Element {
    
    //const currClass: Bank = useContext(BankContext).bank ?? DEFAULT_BANK;
    const navigate = useNavigate();

    const [contents, setContents] = useState<string>("");
    const [view, toggleView] = useState<boolean>(false);

    //let groupRef = ref(getDatabase(), '/groups/' + currClass.bankId + '/bankObj/');
    const user = useContext(AuthContext).user;

    async function save_quiz(aQuiz: Quiz) {
        let code = await create_new_quiz(aQuiz);
        await update_auth_user(user.hash, {...user, quizzes: [...user.quizzes, code]});
        navigate("/teachers/quizzes")
    }

    function importFile(event: React.ChangeEvent<HTMLInputElement>) {
        // Might have removed the file, need to check that the files exist
        if (event.target.files && event.target.files.length) {
            // Get the first filename
            const filename = event.target.files[0];
            if(filename.name.endsWith(".csv")){
                // Create a reader
                const reader = new FileReader();
                // Create lambda callback to handle when we read the file
                reader.onload = (loadEvent) => {
                    // Target might be null, so provide default error value
                    const newContent =
                        loadEvent.target?.result || "Data was not loaded";
                    // FileReader provides string or ArrayBuffer, force it to be string
                    setContents(newContent as string);
                };
                // Actually read the file
                reader.readAsText(filename);
            } else {
                alert("Invalid file type!  Please upload a .csv");
                event.target.value = "";
            }
        }
    }

    function changeToggle() {
        toggleView(true);
    }

    function makeChange() {
        toggleView(false);
        //parsing CSV rows
        const splitRow = contents.split(/\r?\n/);
        let split = splitRow.map((aString: string): string[] => aString.replace("\\\"", "\"").split(","));
        let newSplit: string[] = [];
        let holderString: string = "";
        for(let i=0; i<split.length; i++){
            for(let j=0; j<split[i].length; j++){
                if(!split[i][j].startsWith("\"")){
                    newSplit.push(split[i][j]);
                } else {
                    holderString = split[i][j];
                    j++;
                    while(!split[i][j].endsWith("\"")){
                        holderString = holderString + "," + split[i][j]
                        j++;
                    }
                    holderString = holderString + "," + split[i][j];
                    holderString.slice(1);
                    newSplit.push(holderString);
                }
            }
            split[i] = [...newSplit];
            newSplit = [];
        }
        let newQuiz: Quiz = {
            owner: user.hash,
            title: split[1][0],
            description: split[1][1],
            money: Number(split[1][2]),
            questions: [],
            hash: ""
        }
        let questions = split.splice(3).map(function (questionFields: string[]): QuizQuestion {
            let options = [...questionFields].splice(3, questionFields.length-2);
            options.pop();
            options.pop();
            let newQuest = {
                name: questionFields[0],
                body: questionFields[1],
                points: Number(questionFields[2]),
                options: options.filter((aString: string): boolean => aString !== "").map((aString: string): [string, boolean] => aString === questionFields[questionFields.length-2] ? [aString, true] : [aString, false] ),
                picture_url: questionFields[questionFields.length-1]
            }
            return newQuest;
        });
        if(isNaN(questions[questions.length-1].points)){
            questions.pop();
        }
        newQuiz.questions = questions;
        console.log(newQuiz);
        save_quiz(newQuiz)
        
        //fix pushing quiz here
        /*
        currClass.quizzes.push(newQuiz)
        set(groupRef,currClass)
        */

        setContents("");
    }

    return (
        <div>
            {!view && <Button onClick={changeToggle}>Import Quiz File</Button>}
            {view && (
                <div>
                    <table width="40%" align="center">
                        <td>
                            <Form.Group controlId="exampleForm">
                                <Form.Label>Upload a quiz CSV</Form.Label>
                                <Form.Control type="file" onChange={importFile} />
                            </Form.Group>
                            <Button onClick={makeChange}>Create New Quiz</Button>
                        </td>
                    </table>
                </div>
            )}
        </div>
    );
}
