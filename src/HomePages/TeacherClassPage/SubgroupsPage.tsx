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
import { EditSubgroupsModal } from './EditSubgroupsModal';
import { BsTrashFill } from "react-icons/bs";


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

    //move the two below into a function
    if (check != null) {
        for (let i = 0; i < check.length; i++) {
            dataArr.push(check[i]["userObj"])
        }

    }
    dataArr.forEach((data)=>{
            console.log(data)
        })
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
            var item = usersSnapshot.child('users').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
            console.log(parsedJSonValues)
            for(let i = 0; i < stuIDs.length+1;i++){
                parsedJSonValues.forEach((user)=>{
                    if(user["userObj"]["hash"]===stuIDs[i]){
                        studentsList.push(user)
                    }
                })
            }
            setCheck(studentsList)
        }
        getStudents();
        console.log(check)
    }



    const [showDropDown, setShowDropDown] = React.useState(false)
    const [usernames, setusernames] = useState<string[]>([]);
    const [groupName, setgroupName] = useState<string>("")
    const handleSelect = (selectedList) => {
        setusernames(selectedList);
    };

    const handleRemove = (selectedList) => {
        setusernames(selectedList);
    };

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
        if (usernames.length === 0||groupName===""||nameTaken) {
        if(usernames.length === 0)
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
                selectedValues={usernames} // Preselected value to persist in dropdown
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
        const JValues = Object.values(usernames);
        const parsedJValues = JSON.parse(JSON.stringify(JValues))
        for (let i = 0; i < parsedJValues.length; i++) {
            namesarr.push(parsedJValues[i]["username"])
        }
        errors2(errClass2, "");
        errors(errClass, "");
        setusernames([])
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
       remove(ref(getDatabase(), "/groups/" + classCode.slice(0, 6) + "/bankObj/subgroups/"+key))
        displayGroups();
        //subgroupIDs[3].forEach((el)=>console.log(el))
        
    }
    return (
        <div className="teacher-class-page">
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
            <br></br>
            <Button onClick={showmodals}>Add Group</Button>
            <br></br>
            <br></br>
            <table align="center">
                <th></th>
                <th>Village name</th>
                <th>Students</th>

                {villageArr.map((village, index) => (
                    <tr data-index={index}>
                        <td><Button style={{ background: 'gray' }} onClick={()=>deleteGroup(village.name)}><BsTrashFill color="red"/></Button></td>
                        <td>{village.name}</td>
                        <td>{village.studentList.map((student, id) => (<tr data-index={id}>{student}</tr>))}</td>
                        <td><EditSubgroupsModal code = {classCode} group = {village.name}/></td>
                    </tr>
                ))}
            </table>
        </div>
    )
}
