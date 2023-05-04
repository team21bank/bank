import React, { useContext, useEffect, useState, useCallback } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { getDatabase, ref, get, update, set, push, remove } from 'firebase/database';
import { Form } from 'react-bootstrap';
import { app } from "../../firebase";
import { getAuth } from 'firebase/auth';
import { Subgroup } from "../../Interfaces/Subgroup";
import "./styles.css";
import { Subgroups } from './Subgroups';
import { Multiselect } from "multiselect-react-dropdown";
import { BiEdit } from "react-icons/bi";
import { DEFAULT_BANK_USER, Role, getTitle } from '../../Interfaces/BankUser';

export function EditSubgroupsModal({ code, group }: { code: string , group: string}) {

    const [groupName, setgroupName] = useState<string>(group)
    const [key, setKey]=React.useState("")
    const [students, setStudents] = React.useState<any[]>([]);
    const [showModal, setShowModal] = React.useState(false);
    const [showDropDown, setShowDropDown] = React.useState(false);
    let dataArr: any[] = []
    const [emails, setEmails] = useState<string[]>([]);
    if (students != null) {
        for (let i = 0; i < students.length; i++) {
            dataArr.push(students[i])
        }
    }

    function showmodals(){
        setShowModal(true)
        setShowDropDown(true)
        getStudentsInClass();
    }
    function hidemodals() {
        setShowModal(false)
        setShowDropDown(false)
        setEmails([])
    }

    const handleSelect = (selectedList) => {
        setEmails(selectedList);
    };

    const handleRemove = (selectedList) => {
        setEmails(selectedList);
    };

    const [errmsg, setErrmsg] = useState("");
    const [err, setErr] = useState("");
    const errors = (errClass, errmsg) => {
        setErrmsg(errmsg);
    };
    const errors2 = (errClass2, err) => {
        setErr(err);
    };
    const errClass = "form-control error";
    const errClass2 = "form-control error"
    const submitFormData = e => {
        e.preventDefault();
        let nameTaken = false;
        if (emails.length === 0||groupName===""||nameTaken) {
        if(emails.length === 0)
            errors2(errClass2, "Students can't be empty")
        else if(groupName===""){
            errors(errClass, "Village name can't be nothing");
            }
        }
        else {
            //getStudentsInClass();
            let namesarr: string[] = []
            const JValues = Object.values(emails);
            const parsedJValues = JSON.parse(JSON.stringify(JValues))
            for (let i = 0; i < parsedJValues.length; i++) {
                namesarr.push(parsedJValues[i]["username"])
            }
            console.log(`key is ${key}`)
            update(ref(getDatabase(), "/groups/" + code.slice(0, 6) + "/bankObj/subgroups/" + key), { name: groupName, studentList: namesarr });
            hidemodals()
        }
    }
    const updateFormData = event => {
        setgroupName(event.target.value);
    };
    const DropDown = () => (

        <div className="App">
            <form onSubmit={submitFormData}>
            Select Students
            <Multiselect
                options={dataArr} // Options to display in the dropdown
                selectedValues={emails} // Preselected value to persist in dropdown
                onSelect={handleSelect} // Function will trigger on select event
                onRemove={handleRemove} // Function will trigger on remove event
                displayValue="username" // Property name to display in the dropdown options
                />
                <div><small id="set"> {err}</small></div>
           
                Enter group name
                <br></br>
                <input autoFocus value={groupName} type="text" onChange={e => updateFormData(e)} >
                </input>
                
                <div>
                    <small id="set"> {errmsg}</small>
                </div>
                
                <button type="submit">Submit</button>
            </form>


        </div>)

    function getStudentsInClass() {
        const getStudents = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            
            let stuIDs:string[] = []
            let studentsList: any[] = []
            var students = usersSnapshot.child(`groups/${code.slice(0,6)}/bankObj/studentList`).val();
            const studentsJson = Object.values(students)
            const parsedStudentsJson = JSON.parse(JSON.stringify(studentsJson))
            parsedStudentsJson.forEach((object)=>{
                if(object["uid"]!==""){
                    stuIDs.push(object["uid"])
                }
            })
            var item = usersSnapshot.child('users').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
            for(let i = 0; i < stuIDs.length;i++){
                parsedJSonValues.forEach((user)=>{
                    if (user["userObj"]["hash"] === stuIDs[i]) {

                        parsedStudentsJson.forEach((object) => {
                            if (object["uid"] === stuIDs[i]) {
                                user["userObj"]["username"] = user["userObj"]["username"] + ":" + Role[(object["role"][0])]
                            }
                        })

                        studentsList.push(user["userObj"])
                    }
                })
            }
            setStudents(studentsList)
            console.log("AAAAAAAAAAAAAAAAAA")
            var item2 = usersSnapshot.child('groups/' + code.slice(0, 6) + "/bankObj/subgroups").val();
            if (item2 !== null) {
                const JSonValues2 = Object.values(item2);
                const parsedJSonValues2 = JSON.parse(JSON.stringify(JSonValues2))
            
            parsedJSonValues2.forEach((subgroup)=>{
                if(subgroup["name"]===group){
                for(let i = 0; i<subgroup["studentList"].length;i++)
                    parsedJSonValues.forEach((user)=>{
                        if (user["userObj"]["username"] === subgroup["studentList"][i]) {

                            
                        console.log("AAAAAAAAAAAAAAAAAA"+user["userObj"])
                            emails.push(user["userObj"])
                    }
                })
                }
            })
            }
            else {
                setEmails([])
            }
            


            var item3 = usersSnapshot.child('groups/' + code.slice(0, 6)+"/bankObj").val();
            const JSonValues3 = Object.values(item3);
            const parsedJSonValues3 = JSON.parse(JSON.stringify(JSonValues3))
            console.log(parsedJSonValues3)
            var result = Object.keys(parsedJSonValues3[7]).map((key) => [key.toString(),parsedJSonValues3[7][key]]);
            result.forEach((object)=>{
                if(object[1]["name"]===group){
                    setKey(object[0])
                    }
            })
            
        }
        getStudents();
    }

    return(
        <div>
            <Button onClick={showmodals}><BiEdit/></Button>
            <Modal show={showModal} onHide={hidemodals}>
                <Modal.Header closeButton><h2>Add Group</h2></Modal.Header>
                <Modal.Body>
                    <br /><br />
                    { }
                    {showDropDown ? <DropDown /> : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hidemodals}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}