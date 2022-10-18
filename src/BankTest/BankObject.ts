import { idBal } from "./idBalObject";
export interface Bank {
    /** The ID of the bank*/
    bankId: string;
    /** The ID of the teacher*/
    teacherID: string;
    /** An array of studentID/balance pairs.*/
    studentBals: idBal[];
    /**The title of the class */ 
    classTitle:string;
    /**The description of the class */
    classDescription:string;
}