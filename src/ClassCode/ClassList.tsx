
import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { get_bank } from "../DatabaseFunctions/BankFunctions";
import { Bank, DEFAULT_BANK, copy_bank } from "../Interfaces/BankObject";
import "./ClassList.css";
import { AuthContext } from "../Authentication/auth";
import { ColorModal } from "../HomePages/TeacherHomePage/ColorModal"

export function ClassList({ classes }: { classes: string[] }): JSX.Element {
    return (
        <div className="class-card-list">
            {classes.map(bank_id => <ClassButton key={bank_id} bank_id={bank_id} />)}
        </div>
    )
}


function ClassButton({ bank_id }: { bank_id: string }): JSX.Element {
    const [bank, set_bank] = useState<Bank>(copy_bank(DEFAULT_BANK));

    const user = useContext(AuthContext).user;

    useEffect(() => {
        get_bank(bank_id).then(b => {
            if (b !== null) { set_bank(b); }
        })
    }, []);
    const [showModal, setShowModal] = React.useState(false)
    function test(classcode: string) {
        setShowModal(!showModal)

    }
    var color = "pink"
    //Only render the button if the AuthUser has a BankUser im the bank or is the teacher
    return bank.studentList.find((bank_user) => bank_user.uid === user.hash) || bank.teacherID === user.hash ? (
        <Card className="class-card" >
            <Card.Body >
                <Card.Header  onClick={() => test(bank.bankId)} style={{ color: "black", backgroundColor: color }}><h2>{bank.classTitle}</h2></Card.Header>
                {showModal ? <ColorModal code={bank.bankId } /> : null}
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