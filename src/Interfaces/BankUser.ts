
export interface BankUser {
    
    uid: string,

    isBanker: boolean,

    balance: number,

    role?: [MasteryLevel, Role]
}

export enum Role {
    
}

export enum MasteryLevel {
    Beginner,
    Intermediate,
    Advanced,
    Master
}

export const DEFAULT_BANK_USER: BankUser = {uid: "", isBanker: false, balance: 0};