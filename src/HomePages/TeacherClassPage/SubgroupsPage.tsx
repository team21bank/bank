import React, { useContext, useEffect, useState } from 'react';
import "./TeacherClassPage.css";
import { Modal, Button } from "react-bootstrap";
import { getDatabase, ref, get } from 'firebase/database';
import { Form } from 'react-bootstrap';
import { app } from "../../firebase";
import { getAuth } from 'firebase/auth';
import SearchableDropdown from "./SearchableDropdown";
import { animals } from "./animals";
import "./styles.css";


export function SubgroupsPage({ classCode }: { classCode: string }) {
    
    const [check, setCheck] = React.useState<any[]>([]);
    let dataArr :any[] = []
    let check3:String[]=[]
    
    if (check != null) {
        for (let i = 0; i < check.length; i++) {
            dataArr.push(check[i]["userObj"])
        }
       
    }
    
    console.log(JSON.stringify(dataArr));
    
    
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

    const [value, setValue] = useState("Select option...");
    const [showDropDown, setShowDropDown] = React.useState(false)
    const DropDown = () => (
        <div className="App"><SearchableDropdown
            options={dataArr}//animals
            label="email"
            id="id"
            selectedVal={value}
            handleChange={(val) => setValue(val)}
        /></div>
    )

    return (
        <div>
            <Button onClick={getStudentsInClass}>HELP</Button>
            <Modal show={showModal} onHide={hidemodals}>
                <Modal.Header closeButton><h2>Add Group</h2></Modal.Header>
                <Modal.Body>
                    <br /><br />
                    {showDropDown ? <DropDown/>:null}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hidemodals}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={showmodals}>Add Group</Button>
        </div>
    )
}
