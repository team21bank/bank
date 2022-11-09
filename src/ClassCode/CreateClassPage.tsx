import { onValue, ref, getDatabase, update, set } from "firebase/database";
import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../Authentication/auth";
import { LoadingPage } from "../Authentication/LoadingPage/LoadingPage";
import { auth } from "../firebase";
import { Bank } from "../Interfaces/BankObject";
import { BANKUSER_PLACEHOLDER } from "../Interfaces/BankUser";
import "./CreateClassPage.css";


export function CreateClassPage(): JSX.Element {
    const user = useContext(AuthContext);
    const [newBank, setNewBank] = useState<Bank>({
        bankId: "",
        teacherID: "",
        studentList: [BANKUSER_PLACEHOLDER],
        classTitle: ""
    });
    
    if(newBank.teacherID === "" && auth.currentUser) setNewBank({...newBank, teacherID: auth.currentUser.uid}); //set the bank's teacherID when it is availabe from userObj

    const createCode = () => {
        if (newBank.classTitle===''){
            alert("Please enter a class name")
            return 
        }
        let codeExists=true
        let characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
        let code=""
        while(codeExists)
            codeExists=false
            for (var i=0;i<6;i++){
                code+=characters.charAt(Math.floor(Math.random()*characters.length))
            }
            onValue(ref(getDatabase(),"/groups"),ss=>{
                let groupObj=ss.val();
                if (groupObj!==null){
                    let groupIDS=Object.keys(groupObj);
                    groupIDS.forEach(key => {if(key===code) codeExists=true})
                }
            })
        alert(code)
        user.user ? user.user.groups.push(code+newBank.classTitle): code='';
        update(ref(getDatabase(),"/groups/"+code),{bankObj:{...newBank, bankId: code}});
        if(user.user && auth.currentUser){
           set(ref(getDatabase(),"/users/"+auth.currentUser.uid+"/userObj/groups"),user.user.groups);
        }
        window.location.reload()
    }


    return user.user ? (
        <div className="create-class-page">
            <h1>Create new class</h1>
            <Form.Group controlId="createClass">
                <Form.Label>Class Name: </Form.Label>
                <Form.Control
                    style={{"width": "600px", "marginLeft": "auto", "marginRight": "auto"}}
                    value={newBank.classTitle}
                    onChange={(e) => setNewBank({...newBank, classTitle: e.target.value})}/>
                <Button onClick={createCode} style={{"marginTop": "20px"}}>Create Class Code</Button>
            </Form.Group>
        </div>
    ) : (
        <LoadingPage/>
    )
}

