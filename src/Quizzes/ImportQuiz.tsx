import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ref, getDatabase, onValue, set } from '@firebase/database';
import { Quiz } from "../Interfaces/Quiz";  
import { QuizQuestion } from "../Interfaces/QuizQuestion";
import { Bank } from "../Interfaces/BankObject";

export function ImportQuiz({addQuiz, classCode}: {addQuiz: (newQuiz: Quiz) => void, classCode: string}): JSX.Element {
    const [currClass, setCurrClass] = useState<Bank>({
        bankId:'',
        teacherID:'',
        studentList:[],
        classTitle:'',
        quizzes:[],
    });
    
    useEffect(() => {
        onValue(ref(getDatabase(),"/groups/"+classCode.slice(0,6)+"/bankObj"),ss=>{
            if(currClass !== ss.val()) {
                setCurrClass(ss.val());
            }
        })
    }, [classCode, currClass]);

    const [contents, setContents] = useState<string>("");
    const [view, toggleView] = useState<boolean>(false);

    let groupRef = ref(getDatabase(), '/groups/' + classCode.slice(0,6) + '/bankObj/');

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
            id: 119,
            title: split[1][0],
            description: split[1][1],
            questionTotal: split.length-3,
            money: Number(split[1][2]),
            questions: []
        }
        let questions = split.splice(3).map(function (questionFields: string[]): QuizQuestion {
            let options = [...questionFields].splice(3, questionFields.length-2);
            options.pop();
            let newQuest = {
                id: 0,
                name: questionFields[0],
                body: questionFields[1],
                points: Number(questionFields[2]),
                type: "multiple-choice-question",
                expected: questionFields[questionFields.length-1],
                options: options.filter((aString: string): boolean => aString !== ""),
                published: true
            }
            return newQuest;
        });
        if(isNaN(questions[questions.length-1].points)){
            questions.pop();
        }
        newQuiz.questions = questions;
        newQuiz.questionTotal = questions.length;
        console.log(newQuiz);

        //temporary for testing purposes, replace with storage to firebase
        addQuiz(newQuiz);
        if (currClass.quizzes[0].title ===''){
            currClass.quizzes[0] = newQuiz
        }
        else{
            currClass.quizzes.push(newQuiz);
        }
        set(groupRef,currClass)


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
