import { createUserWithEmailAndPassword } from "@firebase/auth";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { auth } from "../../firebase";
import { ref, getDatabase, onValue, set } from '@firebase/database';
import { BankUser } from "../../Interfaces/BankUser";
import { Bank } from "../../BankTest/BankObject";

export function ImportRoster({currentGroup}: {currentGroup: string}): JSX.Element {
    const [contents, setContents] = useState<string>("");
    const [view, toggleView] = useState<boolean>(false);
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
        //holder bank, will be overwritten if expected bank exists
        let newBank: Bank = {
            bankId: "000000",
            teacherID: "111111",
            studentList: [""],
            classTitle: ""
        };
        //database reference for bank object
        let groupRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/');
        //database reference for list of students within bank object
        let studentListRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/studentList/');
        //Performs all operations on the student information, map acts as a for loop
        splitRow.map(function (loginInfo: string) {
            //separates email from password
            const split = loginInfo.split(",");
            //if CSV is of proper format
            if(split.length === 2 && split[0].includes("@")){
                createUserWithEmailAndPassword(auth,split[0],split[1]).then(somedata=>{
                    let uid=somedata.user.uid;
                    let userRef=ref(getDatabase(),'/users/'+uid)
                    //creates the new user object
                    const newUser: BankUser={
                        username:split[0].split("@")[0],
                        email:split[0],
                        id:split[1],
                        avatar:'',
                        groups:["placeholder", currentGroup],
                        isTeacher: false
                    }
                    //pushes user object to database
                    set(userRef,{userObj:newUser});
                    //within a class, grabs the list of existing students and appends the new student to it
                    onValue(groupRef, ss=>{
                        if(ss.val()!==null){
                            onValue(studentListRef, sval=>{
                                if(newBank.studentList[0] === ""){
                                    if(sval.val() !== null){
                                        let studentList: string[] = sval.val();
                                        newBank = {...ss.val(), studentList:[...studentList]}
                                        //fix conditional for schoolid+uid
                                        ;
                                        if(studentList.filter((aStudent:string): boolean => aStudent.startsWith(split[1])).length === 0){
                                            newBank = {...ss.val(), studentList:[...newBank.studentList, split[1]+uid]}
                                        }
                                    }else{
                                        newBank = {...ss.val(), studentList:["placeholder", split[1]+uid]}
                                    }
                                }else{
                                    if(newBank.studentList.filter((aStudent:string): boolean => aStudent.startsWith(split[1])).length === 0){
                                        newBank = {...ss.val(), studentList:[...newBank.studentList, split[1]+uid]}
                                    }
                                }
                            })
                        }
                    });
                }).catch(function(error){
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);
                    alert(errorMessage);
                });
            }
            return split;
        });

        //pushes the new list of students in the class to the database
        setTimeout(function waitForData() {
            if(newBank.bankId !== "000000"){
                set(studentListRef, newBank.studentList);
            }
            setContents("");
        }, 1000*splitRow.length);
    }

    return (
        <div>
            {!view && <Button onClick={changeToggle}>Import Class Roster</Button>}
            {view && (
                <div>
                    <table width="40%" align="center">
                        <td>
                            <Form.Group controlId="exampleForm">
                                <Form.Label>Upload a roster CSV</Form.Label>
                                <Form.Control type="file" onChange={importFile} />
                            </Form.Group>
                            <Button onClick={makeChange}>Create Student Accounts</Button>
                        </td>
                    </table>
                </div>
            )}
        </div>
    );
}
