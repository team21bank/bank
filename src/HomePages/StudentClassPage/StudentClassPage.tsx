import { getDatabase, onValue, ref, get, update, set, push, remove } from 'firebase/database';
import React, { useContext, useEffect, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthUser, BankContext, DEFAULT_AUTH_USER } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK } from '../../Interfaces/BankObject';
import { BankUser, DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import { UserTransaction } from '../../BankingComponents/UserTransaction';
import "./StudentClassPage.css";
import { Transaction } from '../../Interfaces/Transaction';
import { app } from "../../firebase";
import { Subgroup } from "../../Interfaces/Subgroup";
import { Multiselect } from "multiselect-react-dropdown";
import CurrencyInput from "react-currency-input-field";


export function StudentClassPage({classCode}:{classCode:string}){
    const current_user: AuthUser = useContext(AuthContext).user ?? DEFAULT_AUTH_USER;
    const current_bank: Bank = useContext(BankContext).bank ?? DEFAULT_BANK;
    
    
    const navigate = useNavigate();

    //Real transactions will eventually be saved in the database under a BankUser object
    const placeholder_transactions:Transaction[] = [
        {
        date: new Date(),
        receiver_name: current_user?.id || "user",
        sender_name: "system",
        receiver_description: "starting balance",
        sender_description: "paid out starting balance",
        transfer_amount: 500,
        receiver_balance: 500,
        receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: current_user?.username || "user",
            sender_name: "system",
            receiver_description: "weekly earnings",
            sender_description: "paid out weekly earnings",
            transfer_amount: 150,
            receiver_balance: 650,
            receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: current_user?.username || "user",
            sender_name: "system",
            receiver_description: "quiz earnings",
            sender_description: "paid out quiz earnings",
            transfer_amount: 75,
            receiver_balance: 725,
            receiver_uid: current_user?.id || "0",
        },
        {
            date: new Date(),
            receiver_name: "candle merchant",
            sender_name: current_user?.username || "user",
            receiver_description: "sold candles",
            sender_description: "bought candles",
            transfer_amount: 25,
            receiver_balance: 700,
            receiver_uid: "0",
        }
    ]

    
    //Get AuthUser objects for each student in the class
    const [studentAuthUserList, setStudentAuthUserList] = useState<AuthUser[]>([]);

    const bank_context = useContext(BankContext);
    useEffect(() => { //Update the bank context if this page is navigated to
        onValue(ref(getDatabase(), "/groups/"+classCode.slice(0,6)+"/bankObj"), bank_snapshot => {
            if(bank_snapshot.exists() == false) {return;}
            getStudentList(bank_snapshot.val().studentList, setStudentAuthUserList);
            bank_context.setBank(bank_snapshot.val());
        });
        displayGroups();
        //move the two below into a function
        


    }, []);

    const current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash) ?? DEFAULT_BANK_USER;

    const [showTransactionModal,setShowTransactionModal] = React.useState(false)
    const [showDropDown, setShowDropDown] = React.useState(false)
    function showTransactions(){
        setShowTransactionModal(true)
        setShowDropDown(true)
    }
    function hideTransactions(){
        setShowTransactionModal(false)
        setShowDropDown(false)
        setAmount(0)
        setEmails([])
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
        
        if (emails.length === 0) {
            if (emails.length === 0)
                errors2(errClass2, "Students can't be empty")
        }
        else {
            handleSubmit();
        }
    }
    const handleSubmit = () => {
        setShowDropDown(false)
        setShowTransactionModal(false)
        setEmails([])
        setAmount(0)
    }

    const [emails, setEmails] = useState<string[]>([]);
     const handleSelect = (selectedList) => {
        setEmails(selectedList);
    };

    const handleRemove = (selectedList) => {
        setEmails(selectedList);
    };
    const [amount, setAmount] = React.useState(0)


    const updateFormData = event => {
        if (event === undefined) {
            setAmount(0)
        }
        else {
            setAmount(event);
            //const parsedValue = value.replace(/[^\d.]/gi, "");
            //setAmount(parsedValue);
        }
    };
    
    const DropDown = () => (
        <div className="App">
            <form onSubmit={submitFormData}>
            Select Students
            <Multiselect
                options={students} // Options to display in the dropdown
                selectedValues={emails} // Preselected value to persist in dropdown
                onSelect={handleSelect} // Function will trigger on select event
                onRemove={handleRemove} // Function will trigger on remove event
                displayValue="email" // Property name to display in the dropdown options

                />
                <div><small id="set"> {err}</small></div>
                Enter amount name
                <br></br>
                <CurrencyInput
                    autoFocus
                    allowDecimals
                    decimalSeparator="."
                    prefix="$"
                    decimalsLimit={2}
                    value={amount}
                    defaultValue={0}
                    allowNegativeValue={false}
                    onValueChange={updateFormData}
                    step={1}
                />
                <div>
                    <small id="set"> {errmsg}</small>
                </div>
                <br></br>
                <button type="submit">Submit</button>
            </form>
        </div>)
        

    const [villages, setVillages] = React.useState<any[]>([]);//for storing list of subgroups from database, AKA villages
    const [students, setStudents] = React.useState<any[]>([]);


    
    const displayGroups = () => {

        const object = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item1 = usersSnapshot.child('groups/' + classCode.slice(0, 6) + '/bankObj/subgroups').val();
            const jsonValues = Object.values(item1);
            const parsedjsonValues = (JSON.parse(JSON.stringify(jsonValues)))
            setVillages(parsedjsonValues)
            setVillages((current) =>current.filter((fruit) => fruit.name !== "placeholder"));

            //set student list
            let stuIDs:string[] = []
            let studentsList: any[] = []
            var studs = usersSnapshot.child(`groups/${classCode.slice(0,6)}/bankObj/studentList`).val();
            const studentsJson = Object.values(studs)
            const parsedStudentsJson2 = JSON.parse(JSON.stringify(studentsJson))
            parsedStudentsJson2.forEach((object)=>{
                if(object["uid"]!==""){
                    stuIDs.push(object["uid"])
                }
            })
            
            var item2 = usersSnapshot.child('users').val();
            const JSonValues2 = Object.values(item2);
            const parsedJSonValues2 = JSON.parse(JSON.stringify(JSonValues2))
            for(let i = 0; i < stuIDs.length+1;i++){
                parsedJSonValues2.forEach((user)=>{
                    if(user["userObj"]["hash"]===stuIDs[i]){
                        //students.push(user["userObj"])
                        setStudents((students) => {
                            return students.concat(user["userObj"])
                        })
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
                    {showDropDown ? <DropDown /> : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hideTransactions}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <div>your total balance is {current_bank_user.balance}</div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
            <ViewTransactions transactions={placeholder_transactions} uid={current_bank_user.uid}></ViewTransactions>
        <div>
            <Button onClick={showTransactions}>Pay/Create Transaction</Button>
        </div>

        </div>
        
    )
}



//gets the AuthUser object for each BankUser in the bankUserList
function getStudentList(bankUserList: BankUser[], setStudentList: (students: AuthUser[])=>void) {
    let tmpStudentList: AuthUser[] = [];
    bankUserList.forEach((bankUser, index) => {
        if(bankUser.uid !== "") {
            //console.log("getting object for user ", bankUser.uid);
            onValue(ref(getDatabase(), "/users/"+bankUser.uid), (snapshot) => {
                if(snapshot.val() != null) {
                    //console.log("pushing to student list");
                    tmpStudentList.push(snapshot.val().userObj);
                }
            });
        }
    });


    //weird stuff to wait until the student list is populated
    function check_finished() {
        if(tmpStudentList.length < bankUserList.length - 1) {
            window.setTimeout(check_finished, 100);
        } else {
            setStudentList(tmpStudentList);
            return;
        }
    }
    check_finished();
}