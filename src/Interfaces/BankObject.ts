import { BankUser, resolve_nullish_bankuser } from "./BankUser";
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
    quizzes: string[];

    pendingList: Transaction[];
    completedList: Transaction[];
    color: string;
}

export const DEFAULT_BANK: Bank = {
    bankId: "", teacherID: "", studentList: [], classTitle: "", description: "", quizzes: [], subgroups: [], pendingList: [], completedList: [], color: '#FFFFFF'
}

export function copy_bank(bank: Bank): Bank {
    return JSON.parse(JSON.stringify(bank));
}


export function resolve_nullish_bank(bank: Bank): Bank {
    return {
        bankId: bank.bankId ?? "",
        teacherID: bank.teacherID ?? "",
        studentList: bank.studentList === undefined ? [] : (
            bank.studentList.map(b => resolve_nullish_bankuser(b))
        ),
        classTitle: bank.classTitle ?? "",
        description: bank.description ?? "",
        subgroups: bank.subgroups ?? [],
        quizzes: bank.quizzes ?? [],
        pendingList: bank.pendingList ?? [],
        completedList: bank.completedList ?? [],
        color: bank.color ?? '#FFFFFF'
    }
}