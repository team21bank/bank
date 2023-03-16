import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Multiselect } from "multiselect-react-dropdown";
import { AuthContext } from "../Authentication/auth";
import * as fs from "fs";

export function UserTransaction({ classString }: { classString: string }){
	const [contents, setContents] = useState<string>("");
    const [view, toggleView] = useState<boolean>(false);
    const navigate = useNavigate();
    const user = useContext(AuthContext);
    function getStudentsInClass() {
        const getStudents = async () => {}
        getStudents()
    }
    return(
        <div className="pay">
            <h1>HELLO CRUEL WORLD</h1>
        </div>
        )
}