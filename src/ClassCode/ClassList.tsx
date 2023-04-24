
import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { get_bank } from "../DatabaseFunctions/BankFunctions";
import { Bank, DEFAULT_BANK, copy_bank } from "../Interfaces/BankObject";
import "./ClassList.css";
import { AuthContext } from "../Authentication/auth";

export function ClassList({classes}: {classes: string[]}): JSX.Element {
    return (
        <div>
            {classes.map(bank_id => <ClassButton key={bank_id} bank_id={bank_id}/>)}
        </div>
    )
}

function ClassButton({bank_id}: {bank_id: string}): JSX.Element {
    const [bank, set_bank] = useState<Bank>(copy_bank(DEFAULT_BANK));

    const user = useContext(AuthContext).user;

    useEffect(() => {
        get_bank(bank_id).then(b => {
            if(b !== null) {set_bank(b);}
        })
    }, []);

    //Only render the button if the AuthUser has a BankUser im the bank
    return bank.studentList.find((bank_user) => bank_user.uid===user.hash) || bank.teacherID === user.hash ? (
        <div>
            <Link to={"../"+bank_id}>
                <Button
                    className="class-button"
                    variant="success"
                    size="lg"
                >
                    <h2>{bank.classTitle}</h2>
                    <div>
                        {bank.description !== "" ? (<p className="info-text">{bank.description}</p>) : <></>}
                        <p className="info-text">{bank.studentList.length} students</p>
                    </div>
                </Button>
            </Link>
        </div>
    ) : (
        <></>
    )
}