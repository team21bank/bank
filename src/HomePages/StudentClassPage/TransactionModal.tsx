import { getDatabase, ref, get } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, BankContext, BANK_STORAGE_KEY, change_bank } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER, getTitle } from '../../Interfaces/BankUser';
import "./StudentClassPage.css";
import { get_bank, push_transaction_to_pending } from '../../DatabaseFunctions/BankFunctions';
import { app } from "../../firebase";
import CurrencyInput from "react-currency-input-field";
import { sampleTransactions, makeStudentToStudentTransaction } from '../../Interfaces/Transaction';
import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';
import { PendingTransactionModal } from './BankerTransactionsModal';
import Select from 'react-select';

export function TransactionModal({ classCode }: { classCode: string }) {
    const current_user: AuthUser = useContext(AuthContext).user;
    const current_bank: Bank = useContext(BankContext).bank;

    const navigate = useNavigate();

    const bank_context = useContext(BankContext);
    useEffect(() => { //Update the bank context if this page is navigated to
        displayGroups();
    }, [classCode]);

    const current_bank_user = current_bank.studentList.find(val => val.uid === current_user.hash) ?? DEFAULT_BANK_USER;

    const [showTransactionModal, setShowTransactionModal] = React.useState(false)
    const [showDropDown, setShowDropDown] = React.useState(false)
    function showTransactions() {
        setShowTransactionModal(true)
        setShowDropDown(true)
        setAmount(0)
        setusername('')
        setType('')
    }
    function hideTransactions() {

        setErr('')
        setErrmsg('')
        setTypeErr('')
        setShowTransactionModal(false)
        setShowDropDown(false)


    }
    const [errmsg, setErrmsg] = useState("");
    const [err, setErr] = useState("");
    const [typeErr, setTypeErr] = useState("");
    const errors = (errClass, errmsg) => {
        setErrmsg(errmsg);
    };
    const errors2 = (errClass2, err) => {
        setErr(err);
    };
    const errors3 = (errClass3, typeErr) => {
        setTypeErr(typeErr);
    }
    const errClass = "form-control error";
    const errClass2 = "form-control error";
    const errClass3 = "form-control error";

    const submitFormData = event => {
        event.preventDefault();
        if (username === '' || amount > current_bank_user.balance || type === '') {
            if (username === '') {
                errors2(errClass2, "Students can't be empty")
            }
            if (amount > current_bank_user.balance) {
                errors(errClass, "Insufficient funds in bank account")
            }
            if (type === '') {
                errors3(errClass3, "Enter transaction type!")
            }

        }
        else {
            handleSubmit();
        }
    }

    const [submitJson, setSubmitJson] = React.useState<any[]>([]);//the string of studentList objects
    const handleSubmit = () => {
        console.log(`The senderDescription is ${description} and the receiverDescription is ${description}`)
        const object = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            //get ids of students in class
            let stuIDs: string[] = []
            //get studentlist object
            var studs = usersSnapshot.child(`groups/${classCode.slice(0, 6)}/bankObj/studentList`).val();
            const studentsJson = Object.values(studs)

            //use this when subtracting!!!!!! See below for example on how to use to update value in db (commented out)
            const roundTo = function (num: number, places: number) {
                const factor = 10 ** places;
                return Math.round(num * factor) / factor;
            };

            //declare fields for creating the transaction object, see them used below in transaction object
            let receiverName = username
            let senderName = current_user.username//calculated below, ready to use
            let receiverDescription = description
            let senderDescription = description
            let transferAmount = roundTo(Number(amount), 2) //roundTo here rounds weird decimal values to two decimal places, need this to avoid floating decimal problems
            let receiverBalance = 0 //calculated below, ready to use
            let receiverID = myMap.get(username)
            let shopPurchase = false;
            if (type === "Yes") {
                shopPurchase = true
            }
            let receiverAuthUser: AuthUser = DEFAULT_AUTH_USER;
            let receiverBankUser = current_bank.studentList.find(val => val.uid === receiverID) ?? DEFAULT_BANK_USER;

            let snapshot = await get(ref(getDatabase(app), "/users/" + receiverID + "/userObj"));
            if (snapshot.exists()) {
                receiverAuthUser= snapshot.val();
            }
            //initialize receiverAuthUser (for transaction object)
            //studentAuthUserList
            /*([] as AuthUser[]).forEach(student => {
                if (student.hash === receiverID)
                    receiverAuthUser = student
                console.log("AAAAAAAAAAAAAAAAAAAA"+receiverAuthUser.username)
            })*/

            //parse studentsJson values and push each value to submitJson, which will be used to find sender and receiver information
            //also add each student to the submitJson
            const l = JSON.parse(JSON.stringify(studentsJson))
            l.forEach((m) => {
                submitJson.push(m)
            })

            //add id of student if not null, to the stuIDs array
            submitJson.forEach((object) => {
                if (object["uid"] !== "") {
                    stuIDs.push(object["uid"])
                }
            })

            hideTransactions()

            /***************************
             * The transaction object *
             **************************/
            var transactionObject = makeStudentToStudentTransaction(current_user, current_bank_user, receiverAuthUser, receiverBankUser,
                transferAmount, shopPurchase, description, description)
            console.log(transactionObject)

            push_transaction_to_pending(current_bank.bankId, transactionObject);
            /***************************
             * The transaction object *
             **************************/
        }
        object()
        setSubmitJson([])
    }

    const [username, setusername] = useState<string>('');
    const handleSelect = (e) => {
        setusername(e["username"]);
        console.log(e["username"]);
    };

    const [amount, setAmount] = React.useState(0)


    const updateFormData = event => {
        if (event === undefined) {
            setAmount(0)
        }
        else {
            setAmount(event);
        }
    };

    //react usestates for sender and receiver messages
    const [description, setDescription] = React.useState<string>()
    const getTransactionDescription = event => {
        if (event !== undefined) {
            setDescription(event.target.value)
        }
    }
    const [type, setType] = React.useState<string>()
    const transactionTypes = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
    ]
    const handleType = (e) => {
        if (e !== undefined) {
            setType(e["value"])
        }
    }



    const [villages, setVillages] = React.useState<any[]>([]);//for storing list of subgroups from database, AKA villages
    const [students, setStudents] = React.useState<any[]>([]);
    const [myMap, setMyMap] = React.useState(new Map());
    const [parsedStudentsJson2, setParsedStudentsJson2] = React.useState<any[]>([]);//the string of studentList objects
    const [userusername, setUserusername] = React.useState('')


    const displayGroups = () => {
        setStudents([])
        const object = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item1 = usersSnapshot.child('groups/' + classCode.slice(0, 6) + '/bankObj/subgroups').val();

            const jsonValues = Object.values(item1);
            const parsedjsonValues = (JSON.parse(JSON.stringify(jsonValues)))
            setVillages(parsedjsonValues)
            setVillages((current) => current.filter((fruit) => fruit.name !== "placeholder"));


            //set student list
            let stuIDs: string[] = []
            let studentsList: any[] = []
            var studs = usersSnapshot.child(`groups/${classCode.slice(0, 6)}/bankObj/studentList`).val();
            const studentsJson = Object.values(studs)

            const l = JSON.parse(JSON.stringify(studentsJson))
            l.forEach((m) => {
                parsedStudentsJson2.push(m)
            })
            parsedStudentsJson2.forEach((object) => {
                if (object["uid"] !== "" && object["uid"] !== current_bank_user.uid) {
                    stuIDs.push(object["uid"])
                }
            })

            var item2 = usersSnapshot.child('users').val();
            const JSonValues2 = Object.values(item2);
            const parsedJSonValues2 = JSON.parse(JSON.stringify(JSonValues2))
            for (let i = 0; i < stuIDs.length + 1; i++) {
                parsedJSonValues2.forEach((user) => {
                    if (user["userObj"]["hash"] === stuIDs[i] && user["userObj"]["hash"] !== current_bank_user.uid) {
                        setMyMap(new Map(myMap.set(user["userObj"]["username"], user["userObj"]["hash"])));
                        setStudents((students) => {
                            return students.concat(user["userObj"])
                        })
                    }
                    if (user["userObj"]["hash"] === current_bank_user.uid) {
                        setUserusername(user["userObj"]["username"])
                    }
                })
            }

        }
        object();
    }

    return (
        <div className="student-class-page">
            Students in City: {current_bank.classTitle}
            <table id="table-line" align="center" >

                <th id="th-width">Village name</th>
                <th id="th-width">Students</th>
                {villages.map((village, index) => (
                    <tr data-index={index}>
                        <td id="table-line">{village.name}</td>
                        <td id="table-line">{village.studentList.map((student, id) => (<tr data-index={id}>{student}</tr>))}</td>
                    </tr>
                ))}
            </Table>
            <br></br>
            <Modal show={showTransactionModal} onHide={hideTransactions}>
                <Modal.Header closeButton><h2>Create Payment Request</h2></Modal.Header>
                <Modal.Body>
                    <br /><br />
                    { }
                    {showDropDown ? <form onSubmit={submitFormData}>
                        <b>Select recepient</b>
                        <Select key="f"
                            options={students} // Options to display in the dropdown
                            getOptionLabel={(option) => option.username}
                            getOptionValue={(option) => option.username}
                            onChange={(e) => { handleSelect(e) }}
                        />
                        <div><small id="set"> {err}</small></div>
                        <br></br>
                        <b>Enter amount name</b>
                        <br></br>
                        <div>
                            <CurrencyInput id="myText" key="f"
                                allowDecimals
                                decimalSeparator="."
                                prefix="$"
                                decimalsLimit={2}
                                value={amount}
                                defaultValue={0}
                                allowNegativeValue={false}
                                onValueChange={updateFormData}
                                step={1}
                            /></div>
                        <div>
                            <br></br>
                            <label>
                                <b>What is this for?</b>
                                <br></br>
                                <input
                                    key="f" id="myText2"
                                    maxLength={65}
                                    type="text"
                                    onChange={e => getTransactionDescription(e)}
                                    placeholder="What is this for?"
                                    value={description}
                                    style={{ width: "450px", height: "50px" }}
                                />
                            </label>
                            <br></br>
                            <br></br>
                            <label>
                                <b>Is this a purchase?</b>
                                <Select
                                    options={transactionTypes}
                                    onChange={(e) => { handleType(e) }}

                                />
                            </label>
                            <div>{typeErr}</div>
                        </div>

                        <div>
                            <small id="set"> {errmsg}</small>
                        </div>
                        <br></br>
                        <button type="submit">Submit</button>
                    </form> : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideTransactions}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Button variant="success" size="lg" onClick={showTransactions}>Pay/Create Payment Request</Button>
        </div>
    )
}
