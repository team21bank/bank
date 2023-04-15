import { getDatabase, onValue, ref, get, update, set, push, remove } from 'firebase/database';
import React, { useContext, useEffect, useState  } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, BankContext, BANK_STORAGE_KEY } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER, getTitle } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import "./StudentClassPage.css";
import { Transaction } from '../../Interfaces/Transaction';
import { get_bank } from '../../DatabaseFunctions/BankFunctions';
import { app } from "../../firebase";
import { Subgroup } from "../../Interfaces/Subgroup";
import { Multiselect } from "multiselect-react-dropdown";
import CurrencyInput from "react-currency-input-field";
import { BankingDashboard } from '../../BankingComponents/BankingDashboard';
import { sampleTransactions } from '../../Interfaces/Transaction';
import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';
import { PendingTransactionModal } from './BankerTransactionsModal';
import Select from 'react-select';

export function StudentClassPage({classCode}:{classCode:string}){
    window.sessionStorage.setItem(BANK_STORAGE_KEY, classCode.slice(0,6));

    const current_user: AuthUser = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const current_bank: Bank = useContext(BankContext).bank ?? DEFAULT_BANK;


    const navigate = useNavigate();

    //Real transactions will eventually be saved in the database under a BankUser object


    //Get AuthUser objects for each student in the class
    //const [studentAuthUserList, setStudentAuthUserList] = useState<AuthUser[]>([]);

    const bank_context = useContext(BankContext);
    useEffect(() => { //Update the bank context if this page is navigated to
        
        displayGroups();
        //move the two below into a function

        get_bank(classCode.slice(0,6),bank_context.setBank)

    }, []);

    const current_bank_user = current_bank.studentList.find(val => val.uid === current_user.hash) ?? DEFAULT_BANK_USER;

    const [showTransactionModal, setShowTransactionModal] = React.useState(false)
    const [showDropDown, setShowDropDown] = React.useState(false)
    function showTransactions() {
        setShowTransactionModal(true)
        setShowDropDown(true)
        setAmount(0)
        setEmail('')
    }
    function hideTransactions() {
        setShowTransactionModal(false)
        setShowDropDown(false)
        
        
    }
    const [errmsg, setErrmsg] = useState("");
    const [err, setErr] = useState("");
    const errors = (errClass, errmsg) => {
        setErrmsg(errmsg);
    };
    const errors2 = (errClass2, err) => {
        setErr(err);
    };
    const errClass = "form-control error";
    const errClass2 = "form-control error"
    const submitFormData = event => {
        event.preventDefault();
        if (email === '' || amount > current_bank_user.balance) {
            if (email==='') {
                errors2(errClass2, "Students can't be empty")
            }
            if ( amount > current_bank_user.balance) {
                errors(errClass, "Insufficient funds in bank account")
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
            let stuIDs: string[] = []
            let studentsList: any[] = []
            var studs = usersSnapshot.child(`groups/${classCode.slice(0, 6)}/bankObj/studentList`).val();
            const studentsJson = Object.values(studs)

            const l = JSON.parse(JSON.stringify(studentsJson))
            l.forEach((m) => {
                submitJson.push(m)
            })
            submitJson.forEach((object) => {
                if (object["uid"] !== "") {
                    stuIDs.push(object["uid"])
                }
            })
            hideTransactions()
            var studentID = '';
            var indexf = 0;
            var index2f = 0;
            var studBalf = 0;
            var studBal2f = 0;

            let count = 0;
            const roundTo = function (num: number, places: number) {
                const factor = 10 ** places;
                return Math.round(num * factor) / factor;
            };
            
                studentID = myMap.get(email)
                for (let i = 0; i < submitJson.length; i++) {

                    if (submitJson[i]["uid"] === studentID) {
                        indexf = i

                        studBalf = submitJson[i]["balance"]
                    }
                    if (submitJson[i]["uid"] === current_user.hash) {
                        index2f = i;
                        studBal2f = submitJson[i]["balance"]-(count*Number(amount))
                    }
                }
                console.log(`I am taking ${amount} from ${current_user.email} and giving ${amount} to ${studentID}`)
                let amount1 = Number(amount) + studBalf
                let amount2 = studBal2f - Number(amount)
                console.log(amount1)
                console.log(amount2)

                update(ref(getDatabase(), "/groups/" + classCode.slice(0, 6) + "/bankObj/studentList/" + indexf), { balance: roundTo(Number(amount),2) + roundTo(studBalf,2) });
                update(ref(getDatabase(), "/groups/" + classCode.slice(0, 6) + "/bankObj/studentList/" + index2f), { balance: roundTo(amount2,2)  });

           
            
        }
        object()
        setSubmitJson([])
    }

    const [email, setEmail] = useState<string>('');
    const handleSelect = (e) => {
            setEmail(e["email"]);
            console.log(e["email"]);
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



    const [villages, setVillages] = React.useState<any[]>([]);//for storing list of subgroups from database, AKA villages
    const [students, setStudents] = React.useState<any[]>([]);
    const [myMap, setMyMap] = React.useState(new Map());
    const [parsedStudentsJson2, setParsedStudentsJson2] = React.useState<any[]>([]);//the string of studentList objects
    const [userEmail, setUserEmail] = React.useState('')


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
                if (object["uid"] !== "") {
                    stuIDs.push(object["uid"])
                }
            })

            var item2 = usersSnapshot.child('users').val();
            const JSonValues2 = Object.values(item2);
            const parsedJSonValues2 = JSON.parse(JSON.stringify(JSonValues2))
            for (let i = 0; i < stuIDs.length + 1; i++) {
                parsedJSonValues2.forEach((user) => {
                    if (user["userObj"]["hash"] === stuIDs[i]) {
                        setMyMap(new Map(myMap.set(user["userObj"]["email"], user["userObj"]["hash"])));
                        setStudents((students) => {
                            return students.concat(user["userObj"])
                        })
                    }
                    if (user["userObj"]["hash"] === current_bank_user.uid) {
                        setUserEmail(user["userObj"]["email"])
                    }
                })
            }

        }
        object();
    }

    return (
        <div className="student-class-page">
            Welcome to {classCode.slice(6)}
            <table align="center">

                <th>Village name</th>
                <th>Students</th>
                {villages.map((village, index) => (
                    <tr data-index={index}>
                        <td>{village.name}</td>
                        <td>{village.studentList.map((student, id) => (<tr data-index={id}>{student}</tr>))}</td>
                    </tr>
                ))}
            </table>
            <Modal show={showTransactionModal} onHide={hideTransactions}>
                <Modal.Header closeButton><h2>Create Transactions</h2></Modal.Header>
                <Modal.Body>
                    <br /><br />
                    { }
                    {showDropDown ? <form onSubmit={submitFormData}>
                        Select recepient
                        <Select key="f"
                            options={students} // Options to display in the dropdown
                            //selectedValues={emails} // Preselected value to persist in dropdown
                            getOptionLabel={(option) => option.email}
                            getOptionValue={(option) => option.email}
                            onChange={(e) => { handleSelect(e) }}

                        />
                        <div><small id="set"> {err}</small></div>
                        Enter amount name
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
                            <label>
                                What is this for?
                            <br></br>
                            <input
                                key="f" id="myText2"
                                type="text"
                                onChange={e => getTransactionDescription(e)}
                                placeholder="What is this for?"
                                    value={description}
                                    style={{ width: "400px", height:"100px" }}
                                />
                            </label>
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
            <div>your total balance is {current_bank_user.balance}</div>
            <div>
                <Button onClick={showTransactions}>Pay/Create Transaction</Button>
            </div>

            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
        <br/>
        {getTitle(current_bank_user.role).includes("Banker")?<PendingTransactionModal pendingList = {current_bank.pendingList}></PendingTransactionModal>:<></>}
        <BankingDashboard current_auth_user={current_user} current_bank_user={current_bank_user} bank_transactions={sampleTransactions} bank_name={current_bank.classTitle}></BankingDashboard>
        </div>
    )
}
