
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";


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

    return (
        <div>
            <Link to={"../"+id}><Button>Go To {name}'s class</Button></Link>
        </div>
    )
}