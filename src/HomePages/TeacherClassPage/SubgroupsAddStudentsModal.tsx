import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { BsTrashFill } from "react-icons/bs";
import { RiPlayListAddFill } from "react-icons/ri";
import { AuthUser } from "../../Authentication/auth";
import { firebaseConfig } from "../../firebase";
import { Bank } from "../../Interfaces/BankObject";
import SearchableDropdown from "./SearchableDropdown";
import { animals } from "./animals";
import "./styles.css";

export function StudentsInClass({ classID, setShowModal }: { classID: string, setShowModal: (b) => void }): JSX.Element {
    const [value, setValue] = useState("Select option...");
    return (
        <div className = "App"><SearchableDropdown
            options={animals}
            label="name"
            id="id"
            selectedVal={value}
            handleChange={(val) => setValue(val)}
        /></div>
        )
}