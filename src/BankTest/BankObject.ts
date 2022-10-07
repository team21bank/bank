import { idBal } from "./idBalObject";
export interface Bank {
    /** The ID of the bank*/
    bankId: number;
    /** The ID of the bank, generated on creation(?). */
    studentBals: idBal[];
    /** An array of studentID/balance pairs.*/
}