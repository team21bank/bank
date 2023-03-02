export interface BankUser {
    
    uid: string

    isBanker: boolean

    balance: number
}

export const DEFAULT_BANK_USER: BankUser = {uid: "", isBanker: false, balance: 0};