
import React from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

//TODO:
//MAKE IT SO CLASS LIST DOES NOT WORRY ABOUT PLACEHOLDER ELEMENT
//MAKE IT SO CLASSLIST SHOULD FETCH SOME INFORMATION ABOUT THE CLASS INSTEAD OF USING NAME PAST CODE



export function ClassList({classes}: {classes: string[]}): JSX.Element {
    return (
        <div>
            {classes.map((classString: string) => (
                classString !== "placeholder" ? (
                    <ClassButton classString={classString}/>
                ) : (
                    <></>
                )
            ))}
        </div>
    )
}

function ClassButton({classString}: {classString: string}): JSX.Element {
    const name = classString.slice(6);
    const id = classString.slice(0, 6);

    const navigate = useNavigate();

    return (
        <div>
            <Link to={"../"+id}><Button style={{"backgroundColor": "green", "borderColor": "green", "margin": "0.25em"}} size="lg" onClick={() => navigate("../+id")}>Go To {id.slice(0,6)}</Button></Link>
        </div>
    )
}