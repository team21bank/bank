import { onValue, ref, getDatabase, update, set } from "firebase/database";
import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { AuthContext, AuthUser, getCurrentUser } from "../Authentication/auth";
import { NoUserPage } from "../Authentication/NoUserPage/NoUserPage";
import { Bank } from "../Interfaces/BankObject";
import { BANKUSER_PLACEHOLDER } from "../Interfaces/BankUser";
import "./CreateClassPage.css";


export function CreateClassPage(): JSX.Element {
    const userContext = useContext(AuthContext);
    const [userObj, setUserObj]  = useState<AuthUser>();
    const [newBank, setNewBank] = useState<Bank>({
        bankId: "",
        teacherID: "",
        studentList: [BANKUSER_PLACEHOLDER],
        classTitle: ""
    });
    
    if(userContext.state == null) return <NoUserPage />; //display fail page if attempting to access user page without being logged in
    if(!userObj) getCurrentUser(userContext.state, setUserObj);
    if(newBank.teacherID === "" && userObj) setNewBank({...newBank, teacherID: userContext.state.user.uid}); //set the bank's teacherID when it is availabe from userObj

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
        userObj? userObj.groups.push(code+newBank.classTitle): code='';
        update(ref(getDatabase(),"/groups/"+code),{bankObj:{...newBank, bankId: code}});
        if(userObj){
            if(userContext.state){
                set(ref(getDatabase(),"/users/"+userContext.state.user.uid+"/userObj/groups"),userObj.groups);
            }
        }
        window.location.reload()
    }


    return userObj ? (
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
        <h1>LOADING...</h1>
    )
}

