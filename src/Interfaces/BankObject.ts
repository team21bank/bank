import { idBal } from "../BankTest/idBalObject";
export interface Bank {
    /** The ID of the bank*/
    bankId: string;
    /** The ID of the teacher*/
    teacherID: string;
    /** An array of studentID/balance pairs.*/
    studentList: string[];
    /**The title of the class */ 
    classTitle:string;
}