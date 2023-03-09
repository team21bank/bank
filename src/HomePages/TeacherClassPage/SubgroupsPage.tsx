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


export function SubgroupsPage({ classCode }: { classCode: string }) {


    useEffect(() => {
        displayGroups();
    }, []);
    const [check, setCheck] = React.useState<any[]>([]);//for storing list of users from database
    const [villages, setVillages] = React.useState<any[]>([]);//for storing list of subgroups from database, AKA villages
    const [takenGroupNames, setTakenGroupNames]=React.useState<any[]>([]);
    const [subgroupIDs, setSubgroupIDs]=React.useState<any[]>([]);
    let dataArr: any[] = []
    let villageArr: any[] = []

    if (check != null) {
        for (let i = 0; i < check.length; i++) {
            dataArr.push(check[i]["userObj"])
        }

    }
    if (villages != null) {
        for (let i = 0; i < villages.length; i++) {
            if (villages[i]["name"] !== "placeholder") {
                villageArr.push(villages[i])
            }
        }
    }
    
    //Modal visibility logic
    const [showModal, setShowModal] = useState(false);
    function hidemodals() {
        setShowModal(false)
        setShowDropDown(false)
    }
    function showmodals() {
        setShowModal(true)
        setShowDropDown(true)
        getStudentsInClass()
    }

    function getStudentsInClass() {
        const getStudents = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            
            let stuIDs:string[] = []
            let studentsList: any[] = []
            var students = usersSnapshot.child(`groups/${classCode.slice(0,6)}/bankObj/studentList`).val();
            const studentsJson = Object.values(students)
            const parsedStudentsJson = JSON.parse(JSON.stringify(studentsJson))
            parsedStudentsJson.forEach((object)=>{
                if(object["uid"]!==""){
                    stuIDs.push(object["uid"])
                }
            })
            console.log("GETTING CLASS");
            console.log(stuIDs);
            var item = usersSnapshot.child('users').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
            for(let i = 0; i < stuIDs.length;i++){
                parsedJSonValues.forEach((user)=>{
                console.log(`User id is ${user["userObj"]["hash"]} and current stuID is ${stuIDs[i]}`)
                    if(user["userObj"]["hash"]===stuIDs[i]){
                        studentsList.push(user)
                    }
                })
            }
            console.log(`Students list is ${studentsList}`)
            setCheck(studentsList)
        }
        getStudents();
    }



    const [showDropDown, setShowDropDown] = React.useState(false)
    const [emails, setEmails] = useState<string[]>([]);
    const [groupName, setgroupName] = useState<string>("")
    const handleSelect = (selectedList) => {
        setEmails(selectedList);
    };

    const handleRemove = (selectedList) => {
        setEmails(selectedList);
    };

    const [valid, setvalid] = useState("form-control");
    const [errmsg, setErrmsg] = useState("");
    const [err, setErr] = useState("");
    const errors = (errClass, errmsg) => {
        setErrmsg(errmsg);
    };
    const errors2 = (errClass2, err) => {
        setErr(err);
    };
    const updateFormData = event => {
        setgroupName(event.target.value);
    };
    const errClass = "form-control error";
    const errClass2 = "form-control error"
    const submitFormData = event => {
        event.preventDefault();
        const sucClass = "form-control success";
        let nameTaken = false;
        if (villages != null) {
            for (let i = 0; i < villages.length; i++) {
                if (villages[i]["name"] === groupName) {
                    nameTaken = true; 
                }
            }
        }
        if (emails.length === 0||groupName===""||nameTaken) {
        if(emails.length === 0)
            errors2(errClass2, "Students can't be empty")
        else if(groupName==="")
            errors(errClass, "Village name can't be nothing");
        else if(nameTaken)
            errors(errClass, "Village name already taken!")
        }
        else {
            handleSubmit()
        }
    }
    const DropDown = () => (

        <div className="App">
            <form onSubmit={submitFormData}>
            Select Students
            <Multiselect
                options={dataArr} // Options to display in the dropdown
                selectedValues={emails} // Preselected value to persist in dropdown
                onSelect={handleSelect} // Function will trigger on select event
                onRemove={handleRemove} // Function will trigger on remove event
                displayValue="email" // Property name to display in the dropdown options
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



    /**component for groups modal**/
    const displayGroups = () => {

        const object = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item = usersSnapshot.child('groups/' + classCode.slice(0, 6) + '/bankObj/subgroups').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
            setVillages(parsedJSonValues)
            var item2 = usersSnapshot.child('groups/' + classCode.slice(0, 6) ).val();
            const JSonValues2 = Object.values(item2);
            const parsedJSonValues2 = JSON.parse(JSON.stringify(JSonValues2))
            setSubgroupIDs(parsedJSonValues2)
        }
        object();
        if (villages != null) {
            for (let i = 0; i < villages.length; i++) {
                if (villages[i]["name"] !== "placeholder") {
                    villageArr.push(villages[i])
                    
                }
            }
        }

    }
    /**end of component for groups modal**/

    let namesarr: string[] = []

    const handleSubmit = () => {
        if(!takenGroupNames.includes(groupName,0))
               setTakenGroupNames(takenGroupNames=>[...takenGroupNames,groupName])
        const JValues = Object.values(emails);
        const parsedJValues = JSON.parse(JSON.stringify(JValues))
        for (let i = 0; i < parsedJValues.length; i++) {
            namesarr.push(parsedJValues[i]["email"])
        }
        errors2(errClass2, "");
        errors(errClass, "");
        setEmails([])
        setgroupName("")
        setShowDropDown(false)
        setShowModal(false)
        push(ref(getDatabase(), "/groups/" + classCode.slice(0, 6) + "/bankObj/subgroups"), { name: groupName, studentList: namesarr });
        displayGroups()


    }

    //
    const deleteGroup = (name) =>{
        console.log(`Deleting ${name}`)
        let key = '';
        let object = subgroupIDs[0]["subgroups"]
        var result = Object.keys(object).map((key) => [key.toString(), object[key]]);
        result.forEach((subgroup)=>{
            if(subgroup[1]["name"]===name)
                key = subgroup[0]
        })
        console.log(key)
       remove(ref(getDatabase(), "/groups/" + classCode.slice(0, 6) + "/bankObj/subgroups/"+key))
        displayGroups();
        //subgroupIDs[3].forEach((el)=>console.log(el))
        
    }
    return (
        <div>
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
            <Button onClick={showmodals}>Add Group</Button>
            <br></br>
            <table align="left">

                <th>Village name</th>
                <th>Students</th>

                {villageArr.map((village, index) => (
                    <tr data-index={index}>
                        <td>{village.name}</td>
                        <td>{village.studentList.map((student, id) => (<tr data-index={id}>{student}</tr>))}</td>
                        <td><Button onClick={()=>deleteGroup(village.name)}>Delete Group</Button></td>
                    </tr>
                ))}
            </table>
        </div>
    )
}
