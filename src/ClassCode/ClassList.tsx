
import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { get_bank } from "../DatabaseFunctions/BankFunctions";
import { Bank, DEFAULT_BANK, copy_bank } from "../Interfaces/BankObject";
import "./ClassList.css";
import { AuthContext } from "../Authentication/auth";
import { ColorModal } from "../HomePages/TeacherHomePage/ColorModal"
import Select from 'react-select';
import { getDatabase, ref, get, update, set, push, remove } from 'firebase/database';
import { app } from "../firebase";
import { DEFAULT_AUTH_USER } from '../Interfaces/AuthUser';

export function ClassList({ classes }: { classes: string[] }): JSX.Element {
    return (
        <div className="class-card-list">
            {classes.map(bank_id => <ClassButton key={bank_id} bank_id={bank_id} />)}
        </div>
    )
}


function ClassButton({ bank_id }: { bank_id: string }): JSX.Element {
    const [bank, set_bank] = useState<Bank>(copy_bank(DEFAULT_BANK));
    const current_user = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;

    const user = useContext(AuthContext).user;
    useEffect(() => {
        getColor()
        get_bank(bank_id).then(b => {
            if (b !== null) { set_bank(b); }
        })
    }, []);

    const [classColor, setClassColor] = React.useState('')
    const getColor = () => {
        const asyncGetColor = async () => {
            const db = await getDatabase(app);
            const snapshot = await get(ref(db, '/'))
            var color = snapshot.child('groups/' + bank_id + '/bankObj/color').val()
            setClassColor(color)
        }
        asyncGetColor()
    }
    const [showModal, setShowModal] = React.useState(false)
    function test(classcode: string) {
        if (current_user.isTeacher)
            setShowModal(!showModal)
        else
            setShowModal(false)
    }

    const handleSelect = (e) => {
        setClassColor(e["color"]);
        update(ref(getDatabase(), "/groups/" + bank_id + "/bankObj"), { color: e["color"] });
    };

    const colorStyles = {
        option: (styles, { data }) => {
            return {
                ...styles,
                backgroundColor: data.color
            };
        }
    };

    const colorsArray = [
        { label: "Red", value: 1, color: "#FF8B8B" },
        { label: "Green", value: 2, color: "#ABFF8B" },
        { label: "Blue", value: 3, color: "#ADD8E6" },
        { label: "Pink", value: 4, color: "#FDA4BA" },
        { label: "Yellow", value: 5, color: "#FFFF00" },
        { label: "Purple", value: 6, color: "#A45EE9" },
        { label: "Gold", value: 7, color: "#F7E78A" },
        { label: "Silver", value: 8, color: "#DCDCDC" },
        { label: "White", value: 9, color: "#FFFFFF" },
        { label: "Black", value: 10, color: "#454545" },
        { label: "Brown", value: 11, color: "#795C34" },
        {label: "Gray", value:12 , color:"#6F6F6F"}

    ];
    const ColorModal = () => {
        return (
            <Select
                options={colorsArray} // Options to display in the dropdown
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.color}
                styles={colorStyles}
                onChange={(e) => { handleSelect(e) }}
            />
        )
    }
    //Only render the button if the AuthUser has a BankUser im the bank or is the teacher
    return bank.studentList.find((bank_user) => bank_user.uid === user.hash) || bank.teacherID === user.hash ? (
        <Card className="class-card" >
            <Card.Body >
                <Card.Header onClick={() => test(bank.bankId)} style={{ color: "black", backgroundColor: classColor }}><h2>{bank.classTitle}</h2></Card.Header>
                {showModal ? <ColorModal /> : null}
                <Card.Text>
                    {bank.description}
                </Card.Text>
                <Link to={"../" + bank_id}><Button size="lg">Open</Button></Link>
            </Card.Body>
        </Card>
    ) : (
        <></>
    )
}