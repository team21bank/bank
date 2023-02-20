import { BankUser } from "./BankUser";
import { Subgroup } from "./Subgroup";

export interface Bank {
    /** The ID of the bank*/
    bankId: string;
    /** The ID of the teacher*/
    teacherID: string;
    /** An array of studentID/balance pairs.*/
    studentList: BankUser[];
    /**The title of the class */ 
    classTitle: string;
    /** An array of subgroups and their students */
    subgroups: Subgroup[];
}