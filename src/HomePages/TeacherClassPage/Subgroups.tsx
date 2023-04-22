import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { SubgroupsPage } from './SubgroupsPage';
import { AuthContext } from "../../Authentication/auth";
import { useContext } from 'react';
import { Button } from "react-bootstrap";



export function Subgroups({ classID }: { classID: string }): JSX.Element {
    const [contents, setContents] = useState<string>("");
    const [view, toggleView] = useState<boolean>(false);
    const navigate = useNavigate();
     //let groupRef = ref(getDatabase(), '/groups/' + classID.slice(0,6) + '/bankObj/');
    //let subgroupsRef = ref(getDatabase(), '/groups/' + classID.slice(0, 6) + '/groups/');



    const user = useContext(AuthContext);
    const [showResults, setShowResults] = React.useState(false)
    const Results = () => (
        <div id="results">
            Please check your email for link to reset your password. Be sure to check your spam/junk if link does not appear
        </div>
    )
    function reloadPage() {
        navigate(`/teachers/${classID.slice(0, 6)}/groups`);
    }

    return (
        <div className="teacher-home">
            <br />
            <div>
                <Button className="groups-button" onClick={reloadPage}>Groups</Button>
            </div>
        </div>
    )
}
