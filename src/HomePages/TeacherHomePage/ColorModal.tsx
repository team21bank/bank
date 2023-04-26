import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Modal, Button, Col, Row } from "react-bootstrap";
import { getDatabase, ref, get, update, set, push, remove } from 'firebase/database';
import { Form } from 'react-bootstrap';
import { app } from "../../firebase";
import { getAuth } from 'firebase/auth';
import { BiEdit } from "react-icons/bi";
import Select from 'react-select';
import { hide } from '@popperjs/core';

export function ColorModal({ code }: { code: string }) {
    const [Color,setColor] = React.useState('')
    const handleSelect = (e) => {
        setColor(e["color"]);
        console.log(e["color"])
        update(ref(getDatabase(), "/groups/" + code.slice(0, 6) + "/bankObj"), { color: Color});
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
        { label: "Blue", value: 3, color: "#80CEAC" }
    ];
    return (
        <div>
                <Select
                options={colorsArray} // Options to display in the dropdown
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.color}
                styles={colorStyles}
                onChange={(e) => { handleSelect(e) }}
                />
        </div>
    )
}