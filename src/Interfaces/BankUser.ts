import { QuizResult, resolve_nullish_quizresult } from "./QuizResult";

export interface BankUser {
    
    uid: string,

    isBanker: boolean,

    balance: number,

    role: [Role, MasteryLevel],

    alias: string,

    finishedQuizzes: QuizResult[]
}

export function resolve_nullish_bankuser(b: BankUser): BankUser {
    return {
        uid: b.uid ?? "",
        isBanker: b.isBanker ?? false,
        balance: b.balance ?? 0,
        role: b.role ?? [Role.None, MasteryLevel.None],
        alias: b.alias ?? "",
        finishedQuizzes: b.finishedQuizzes === undefined ? [] : (
            b.finishedQuizzes.map(r => resolve_nullish_quizresult(r))
        )
    }
}

export enum Role {
    None,
    Noble,
    Artist,
    Merchant,
    Explorer,
    Banker,
    Ascetic
}

export enum MasteryLevel {
    None,
    Apprentice,
    Journeyman,
    Master
}


export const DEFAULT_BANK_USER: BankUser = {uid: "", isBanker: false, balance: 0, role: [Role.None, MasteryLevel.None], alias: "", finishedQuizzes: []};

export function getTitle(role: [Role, MasteryLevel]): String {
    if(role === undefined) {return "None";}
    let title = "";
    
    switch(role[1]) {
        case MasteryLevel.None:
            break;
        case MasteryLevel.Apprentice:
            title+="Apprentice ";
            break;
        case MasteryLevel.Journeyman:
            title+="Journeyman "
            break;
        case MasteryLevel.Master:
            title+="Master "
            break;
    }

    switch(role[0]) {
        case Role.None:
            break;
        case Role.Artist:
            title+="Artist";
            break;
        case Role.Ascetic:
            title+="Ascetic";
            break;
        case Role.Banker:
            title+="Banker";
            break;
        case Role.Explorer:
            title+="Explorer";
            break;
        case Role.Merchant:
            title+="Merchant";
            break;
        case Role.Noble:
            title+="Noble";
    }

    return title==="" ? "None" : title;
}