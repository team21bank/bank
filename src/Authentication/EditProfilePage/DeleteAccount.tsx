import { auth } from "../../firebase"
import { get, set, getDatabase, ref, remove } from "firebase/database";
import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import { AuthUser, STORAGE_KEY } from "../auth";
import { Bank } from "../../Interfaces/BankObject";
import { useNavigate } from "react-router-dom";

export function DeleteAccountModal(): JSX.Element {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    function delete_current_user(){
        //TODO: If user is a teacher, also delete all owned classes
        const currUser = auth.currentUser;
        if(!currUser) return;
        
        const user_ref = ref(getDatabase(), "/users/"+currUser.uid);
        get(user_ref).then(user_snapshot => {
            //For each group the user is in, get the group's object and remove the student from it.
            const current_user_object: AuthUser = user_snapshot.val().userObj; //get user value
            
            current_user_object.groups.forEach(str => {
                if(str === "placeholder") return;
                const bank_ref = ref(getDatabase(), "/groups/"+str.slice(0,6));
                get(bank_ref).then(bank_snapshot => {
                    let bank: Bank = bank_snapshot.val().bankObj;
                    const new_students_list = bank.studentList.filter(bank_user => bank_user.uid!==currUser.uid);
                    set(bank_ref, {bankObj: {...bank, studentList: new_students_list}});
                });
            });
        }).catch((reason) => {
            console.log(reason);
        }).finally(() => {
            remove(user_ref); //delete userObj from database
            currUser.delete(); //delete user from firebase authentication
            sessionStorage.removeItem(STORAGE_KEY); //remove login info from session storage
            navigate("/");
        });
    }

    return (
        <div>
            <Modal show={showModal} onHide={()=>setShowModal(false)}>
                <Modal.Header closeButton><h2>Delete Account</h2></Modal.Header>
                <Modal.Body style={{"textAlign": "center", "fontSize": "150%", "color": "red"}}>
                    Are you sure you want to continue?<br />
                    This action is irreversible!
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={delete_current_user}>Confirm</Button>
                </Modal.Footer>
            </Modal>
            <Button variant="danger" onClick={()=>setShowModal(true)}>Delete Account</Button>
        </div>
    )
}







