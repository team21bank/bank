import { getDatabase, ref, get } from 'firebase/database';
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext, BankContext, BANK_STORAGE_KEY } from "../../Authentication/auth";
import { Bank, DEFAULT_BANK } from '../../Interfaces/BankObject';
import { DEFAULT_BANK_USER } from '../../Interfaces/BankUser';
import { ViewTransactions } from '../../BankingComponents/ViewTransactions';
import "./StudentClassPage.css";
import { Transaction } from '../../Interfaces/Transaction';
import { get_bank } from '../../DatabaseFunctions/BankFunctions';
import { app } from "../../firebase";
import { Subgroup } from "../../Interfaces/Subgroup";
import { BankingDashboard } from '../../BankingComponents/BankingDashboard';
import { sampleTransactions } from '../../Interfaces/Transaction';
import { AuthUser, DEFAULT_AUTH_USER } from '../../Interfaces/AuthUser';

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
        get_bank(classCode.slice(0,6), bank_context.setBank)
    }, []);

    const current_bank_user = current_bank.studentList.find(val => val.uid===current_user.hash) ?? DEFAULT_BANK_USER;

    const [villages, setVillages] = React.useState<any[]>([]);//for storing list of subgroups from database, AKA villages
    const [villageArr, setVillageArr] = React.useState<any[]>([]);
    let villageA: any[] = []
    const displayGroups = () => {

        const object = async () => {
            const db = await getDatabase(app);
            const usersSnapshot = await get(ref(db, '/'))
            var item = usersSnapshot.child('groups/' + classCode.slice(0, 6) + '/bankObj/subgroups').val();
            const JSonValues = Object.values(item);
            const parsedJSonValues = (JSON.parse(JSON.stringify(JSonValues)))
            setVillages(parsedJSonValues)
            setVillages((current) =>current.filter((fruit) => fruit.name !== "placeholder"));
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
            <div>your total balance is {current_bank_user.balance}</div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/quizzes")}> Go to Quizzes </Button>
        <div>
            <Button onClick={()=>navigate("/students/"+classCode.slice(0,6)+"/pay")}>Pay/Create Transaction</Button>
        </div>
        <br/>
        <BankingDashboard current_auth_user={current_user} current_bank_user={current_bank_user} bank_transactions={sampleTransactions} bank_name={current_bank.classTitle}></BankingDashboard>
        </div>
        
    )
}
