
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { get_bank } from "../DatabaseFunctions/BankFunctions";
import { Bank, DEFAULT_BANK } from "../Interfaces/BankObject";
import "./ClassList.css";

//TODO:
//MAKE IT SO CLASS LIST DOES NOT WORRY ABOUT PLACEHOLDER ELEMENT
//MAKE IT SO CLASSLIST SHOULD FETCH SOME INFORMATION ABOUT THE CLASS INSTEAD OF USING NAME PAST CODE



export function ClassList({classes}: {classes: string[]}): JSX.Element {
    return (
        <div>
            {classes.map(bank_id => <ClassButton bank_id={bank_id}/>)}
        </div>
    )
}

function ClassButton({bank_id}: {bank_id: string}): JSX.Element {
    const [bank, set_bank] = useState<Bank>(DEFAULT_BANK);

    useEffect(() => {
        get_bank(bank_id).then(b => {
            if(b !== null) {set_bank(b);}
        })
    }, [])

    return bank !== DEFAULT_BANK ? (
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