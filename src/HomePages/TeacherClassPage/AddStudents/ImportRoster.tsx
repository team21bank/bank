import { createUserWithEmailAndPassword } from "@firebase/auth";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { auth, firebaseConfig } from "../../../firebase";
import { initializeApp, deleteApp } from "firebase/app";
import { ref, getDatabase, onValue, set } from '@firebase/database';
import { AuthUser } from "../../../Authentication/auth";
import { Bank } from "../../../Interfaces/BankObject";
import { BankUser, BANKUSER_PLACEHOLDER } from "../../../Interfaces/BankUser";
import { getAuth } from "firebase/auth";

export function ImportRoster({currentGroup, setShowModal}: {currentGroup: string, setShowModal: (b)=>void}): JSX.Element {
    const [contents, setContents] = useState<string>("");
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

    function makeChange() {
        const splitRow = contents.split(/\r?\n/);
        let newBank: Bank = {
            bankId: "000000",
            teacherID: "111111",
            studentList: [BANKUSER_PLACEHOLDER],
            classTitle: ""
        };
        let groupRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/');
        let studentListRef = ref(getDatabase(), '/groups/' + currentGroup.slice(0,6) + '/bankObj/studentList/');
        //Must create a second firebase app here so the teacher that is currently logged in does not become logged out upon creating accounts
        const secondary_app = initializeApp(firebaseConfig, "secondary app");
        splitRow.map(function (loginInfo: string) {
            const split = loginInfo.split(",");
            if(split.length === 2 && split[0].includes("@")){
                createUserWithEmailAndPassword(getAuth(secondary_app),split[0],split[1]).then(somedata=>{
                    let uid=somedata.user.uid;
                    let userRef=ref(getDatabase(),'/users/'+uid)
                    const newUser: AuthUser={
                        username:split[0].split("@")[0],
                        email:split[0],
                        id:split[1],
                        avatar:'',
                        groups:["placeholder", currentGroup],
                        isTeacher: false,
                        hash: uid
                    }
                    set(userRef,{userObj:newUser});
                    onValue(groupRef, ss=>{
                        if(ss.val()!==null){
                            onValue(studentListRef, sval=>{
                                if(newBank.studentList[0] === BANKUSER_PLACEHOLDER){
                                    //console.log("test1");
                                    if(sval.val() !== null){
                                        let studentList: BankUser[] = sval.val();
                                        newBank = {...ss.val(), studentList:[...studentList]}
                                        if(studentList.filter(user => user.uid === split[1]).length < 1){
                                            newBank = {...ss.val(), studentList:[...newBank.studentList, {uid: uid, isBanker: false, balance: 0}]}
                                        }
                                    }else{
                                        //console.log("test2")
                                        newBank = {...ss.val(), studentList:[BANKUSER_PLACEHOLDER, {uid: uid, isBanker: false, balance: 0}]}
                                    }
                                }else{
                                    //console.log("test3");
                                    if(newBank.studentList.filter(user => user.uid === split[1]).length < 1){
                                        newBank = {...ss.val(), studentList:[...newBank.studentList, {uid: uid, isBanker: false, balance: 0}]}
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
                deleteApp(secondary_app); //delete the secondary firebase app now that new user account have been created
            }
            setContents("");
        }, 1000*splitRow.length);
    }

    return (
        <div>
            <table align="center">
                <td>
                    <Form.Group controlId="exampleForm">
                        <Form.Label>
                            *Column A should contain student's email addresses.
                            *Column B should contain each student's password.
                            *Passwords must be at least 6 characters in length.
                        </Form.Label>
                        <Form.Control type="file" onChange={importFile} />
                        <br/>
                    </Form.Group>
                    <Button variant="success" onClick={makeChange}>Create Student Accounts</Button>
                </td>
            </table>
        </div>
    );
}
