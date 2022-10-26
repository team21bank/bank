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
        }
    }

    function changeToggle() {
        toggleView(true);
    }

    function makeChange() {
        toggleView(false);
        const splitRow = contents.split(/\r?\n/);
        let newBank: Bank = {
            bankId: "000000",
            teacherID: "111111",
            studentList: [""],
            classDescription: "",
            classTitle: ""
        };
        let groupRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/');
        let studentListRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/studentList/');
        splitRow.map(function (loginInfo: string) {
            const split = loginInfo.split(",");
            if(split.length === 2 && split[0].includes("@")){
                createUserWithEmailAndPassword(auth,split[0],split[1]).then(somedata=>{
                    let uid=somedata.user.uid;
                    let userRef=ref(getDatabase(),'/users/'+uid)
                    const newUser: BankUser={
                        username:split[0].split("@")[0],
                        email:split[0],
                        id:split[1],
                        avatar:'',
                        groups:["placeholder", currentGroup],
                        isTeacher: false
                    }
                    set(userRef,{userObj:newUser});
                    onValue(groupRef, ss=>{
                        if(ss.val()!==null){
                            onValue(studentListRef, sval=>{
                                if(newBank.studentList[0] === ""){
                                    //console.log("test1");
                                    if(sval.val() !== null){
                                        let studentList: string[] = sval.val();
                                        newBank = {...ss.val(), studentList:[...studentList]}
                                        if(!studentList.includes(split[1])){
                                            newBank = {...ss.val(), studentList:[...newBank.studentList, split[1]]}
                                        }
                                    }else{
                                        //console.log("test2")
                                        newBank = {...ss.val(), studentList:["placeholder", split[1]]}
                                    }
                                }else{
                                    //console.log("test3");
                                    if(!newBank.studentList.includes(split[1])){
                                        newBank = {...ss.val(), studentList:[...newBank.studentList, split[1]]}
                                    }
                                }
                                //console.log(newBank.studentList);
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

        setTimeout(function waitForData() {
            //console.log(newBank);
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
