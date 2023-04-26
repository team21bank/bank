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
    /**A small description of the class */
    description: string;
    /** An array of subgroups and their students */
    subgroups: Subgroup[];
    /**List of quizzes for a class */
    quizzes: Quiz[];
    color: string;
    pendingList: Transaction[];
    completedList: Transaction[];
}

export const DEFAULT_BANK: Bank = {
    bankId: "", teacherID: "", studentList: [], classTitle: "", description: "", quizzes: [], color: 'FFFFFF', subgroups: [], pendingList: [], completedList: []
}

export function copy_bank(bank: Bank): Bank {
    return JSON.parse(JSON.stringify(bank));
}


export function resolve_nullish_bank(bank: Bank): Bank {
    return {
        bankId: bank.bankId ?? "",
        teacherID: bank.teacherID ?? "",
        studentList: bank.studentList ?? [],
        classTitle: bank.classTitle ?? "",
        description: bank.description ?? "",
        subgroups: bank.subgroups ?? [],
        quizzes: bank.quizzes ?? [],
        color: bank.color ?? 'FFFFFF',
        pendingList: bank.pendingList ?? [],
        completedList: bank.completedList ?? []
    }
}