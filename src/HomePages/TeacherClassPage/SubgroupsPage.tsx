import React, { useContext, useEffect, useState, useCallback } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { getDatabase, ref, get, update, set, push } from 'firebase/database';
import { Form } from 'react-bootstrap';
import { app } from "../../firebase";
import { getAuth } from 'firebase/auth';
import SearchableDropdown from "./SearchableDropdown";
import { Subgroup } from "../../Interfaces/Subgroup";
import { animals } from "./animals";
import "./styles.css";
import { Subgroups } from './Subgroups';
import { Multiselect } from "multiselect-react-dropdown";


export function SubgroupsPage({ classCode }: { classCode: string }) {
    
    useEffect(() => {
  GroupModal();
}, []);
    const [check, setCheck] = React.useState<any[]>([]);//for storing list of users from database
    const [villages, setVillages] = React.useState <any[]>([]);//for storing list of subgroups from database, AKA villages
    let dataArr :any[] = []
    let villageArr:any[] = []
    
    if (check != null) {
        for (let i = 0; i < check.length; i++) {
            dataArr.push(check[i]["userObj"])
        }
       
    }
    if (villages != null) {
        for (let i = 0; i < villages.length; i++) {
            villageArr.push(villages[i])
        }
    }
    //below function does same thing as getStudentsInClass. kept here bc it was cool
    /*React.useEffect(() => {
        async function checkData() {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item = usersSnapshot.child('users').val();
            const JSonValues = Object.values(item);
            const data = JSON.parse(JSON.stringify(JSonValues))
            setCheck(data);
        }
        checkData();
    }, []);
    */
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
            var item = usersSnapshot.child('users').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
            setCheck(parsedJSonValues)
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
    
    const updateFormData = event =>
            setgroupName(event.target.value);
    const DropDown = () => (

    <div className="App">
        <form onSubmit={handleSubmit}>
            <Multiselect
                options={dataArr} // Options to display in the dropdown
                selectedValues={emails} // Preselected value to persist in dropdown
                onSelect={handleSelect} // Function will trigger on select event
                onRemove={handleRemove} // Function will trigger on remove event
                displayValue="email" // Property name to display in the dropdown options
            />
            <div id="results">
                Enter group name
                <input autoFocus value={groupName}type="text" onChange={e => updateFormData(e)}>
            </input>
            </div>
    
            <button type="submit">Create Village</button>
        </form>
    </div>)



    /**component for groups modal**/
    const GroupModal = () => {
        const object = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item = usersSnapshot.child('groups/' + classCode.slice(0,6) + '/bankObj/subgroups').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = JSON.parse(JSON.stringify(JSonValues))
            setVillages(parsedJSonValues)
        }
        object();
         if (villages != null) {
        for (let i = 0; i < villages.length; i++) {
            if(villages[i]["name"]!=="placeholder")  {
                villageArr.push(villages[i])
                console.log(villages[i]["name"])}
        }
    }
        
    }
    /**end of component for groups modal**/
    
    let namesarr :string[] = []
 
    const handleSubmit=()=>{
            const JValues = Object.values(emails);
            const parsedJValues = JSON.parse(JSON.stringify(JValues))
           for(let i = 0; i<parsedJValues.length;i++)
            {
            namesarr.push(parsedJValues[i]["email"])
            }
            setShowDropDown(false)
            setShowModal(false)
            push(ref(getDatabase(), "/groups/" + classCode.slice(0, 6) + "/bankObj/subgroups"), {name: groupName, studentList: namesarr  });
            GroupModal()

           
    }
    return (
        <div>
            
            <Button onClick={getStudentsInClass}>HELP</Button>
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
                        <td>{village.studentList.map((student, id)=>(<tr data-index={id}>{student}</tr>))}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

