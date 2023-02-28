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


export function SubgroupsPage({ classCode }: { classCode: string }) {
    
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
        setShowForm(false)
    }
    function showmodals() {
        setShowModal(true)
        setShowDropDown(true)
        setShowForm(true)
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

    const [value, setValue] = useState("Select option...");
    const [showDropDown, setShowDropDown] = React.useState(false)
    const [showForm, setShowForm] = React.useState(false)
    const DropDown = () => (
  
        <div className="App"><SearchableDropdown
            options={dataArr}//animals
            label="email"
            id="id"
            selectedVal={value}
            handleChange={(val) => setValue(val)}
        />
        </div>
    )

    /**component for groups modal**/
    const [showGroups, setShowGroups] = useState(false);
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
        villageArr.forEach((el) => {
            console.log(el)
        })
        console.log("Printing out the villages lmao" + villageArr)
        return (
            
            <div>
                
                <table align="left">
                
                    <th>Village name</th>  
                    <th>Students</th>

                    {villageArr.map((village, index) => (
                        <tr data-index={index}>
                            <td>{village.name}</td>
                            <td>{village.studentList }</td>
                        </tr>
                    ))}  
                    {/** } <Row>
                                    <Col>
                                        Students :{value}
                                    </Col>  
                    </Row>
                    */}
                </table>
                </div>
            
            )
        
    }
    /**end of component for groups modal**/
    /**Set the name field for each subgroup
     * */
    const [groupName, setgroupName] = useState<string>("")
    const Form = () => {
        
        const updateFormData = event =>
            setgroupName(event.target.value);

        return (
            <div id="results">
                Enter group name
                <input autoFocus value={groupName}type="text" onChange={e => updateFormData(e)}>
            </input>
            </div>
    )
    }

    /**end of set name field for each subgroup */
    /*return value from form*/
    const [group, setGroup] = useState<Subgroup>({
        name: "placeholder",
        studentList: [value]
    })
    const handleSubmit=()=>{
        console.log(`Value is ${value}`)
        setGroup({ ...group, studentList: [value] })
        setShowDropDown(false)
        setShowForm(false)
        setShowModal(false)
        setShowGroups(true)
        push(ref(getDatabase(), "/groups/" + classCode.slice(0, 6) + "/bankObj/subgroups"), { ...group, name: groupName  });
        return (
            <div>
                <GroupModal/>
            </div>
            )
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
                    {showForm ? <Form/> : null }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit}>Create groups</Button>
                    <Button onClick={hidemodals}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={showmodals}>Add Group</Button>
            <GroupModal />
        </div>
    )
}

