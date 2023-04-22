import { ref, getDatabase, update, set } from "firebase/database";
import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../Authentication/auth";
import { auth } from "../firebase";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import { DEFAULT_BANK_USER } from "../Interfaces/BankUser";
import { QUIZ_PLACEHOLDER } from "../Interfaces/Quiz";
import { SUBGROUPS_PLACEHOLDER } from "../Interfaces/Subgroup";
import "./CreateClassPage.css";
import { create_new_bank } from "../DatabaseFunctions/BankFunctions";
import { DEFAULT_AUTH_USER } from "../Interfaces/AuthUser";
import { update_auth_user } from "../DatabaseFunctions/UserFunctions";
import { useNavigate } from "react-router-dom";


export function CreateClassPage(): JSX.Element {
    const user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const [bank_name, set_bank_name] = useState("")
    
    const navigate = useNavigate()

    async function createCode() {  
        if(bank_name==="") {return Promise.reject("Bank name cannot be empty")}
        
        while(true) {
            let characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
            let code = ""
            for (var i=0;i<6;i++){
                code+=characters.charAt(Math.floor(Math.random()*characters.length))
            }
            try {
                await create_new_bank(code, user.hash, bank_name)
                await update_auth_user(user.hash, {...user, groups: [...user.groups, code]})
                return code;
            } finally {}
        }
        

        /*if (newBank.classTitle===''){
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
        */
    }


    return (
        <div className="create-class-page">
            <h1>Create new class</h1>
            <Form.Group controlId="createClass">
                <Form.Label>Class Name: </Form.Label>
                <Form.Control
                    style={{"width": "600px", "marginLeft": "auto", "marginRight": "auto"}}
                    value={bank_name}
                    onChange={(e) => set_bank_name(e.target.value)}/>
                <Button onClick={() => createCode().then((code) => navigate("/teachers/"+code))} style={{"marginTop": "20px"}}>Create Class Code</Button>
            </Form.Group>
        </div>
    )
}

