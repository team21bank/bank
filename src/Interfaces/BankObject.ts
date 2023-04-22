import { BankUser } from "./BankUser";
import { Subgroup } from "./Subgroup";
import { Quiz } from "./Quiz";
import { Transaction } from "./Transaction";

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
    /**List of quizzes for a class */
    quizzes: Quiz[];

    pendingList: Transaction[];
    completedList: Transaction[];
}

export const DEFAULT_BANK: Bank = {
    bankId: "", teacherID: "", studentList: [], classTitle: "", quizzes: [], subgroups: [], pendingList: [], completedList: []
}

export function resolve_nullish_bank(bank: Bank): Bank {
    return {
        bankId: bank.bankId ?? DEFAULT_BANK.bankId,
        teacherID: bank.teacherID ?? DEFAULT_BANK.teacherID,
        studentList: bank.studentList ?? DEFAULT_BANK.studentList,
        classTitle: bank.classTitle ?? DEFAULT_BANK.classTitle,
        subgroups: bank.subgroups ?? DEFAULT_BANK.subgroups,
        quizzes: bank.quizzes ?? DEFAULT_BANK.quizzes,
        pendingList: bank.pendingList ?? DEFAULT_BANK.pendingList,
        completedList: bank.completedList ?? DEFAULT_BANK.completedList
    }
}