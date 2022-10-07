import { idBal } from "./idBalObject";
export interface Bank {
    /** The ID of the bank*/
    bankId: string;
    /** The ID of the bank, generated on creation(?). */
    studentBals: idBal[];
    /** An array of studentID/balance pairs.*/
}