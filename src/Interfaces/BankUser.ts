export interface BankUser {
    
    uid: string

    isBanker: boolean

    balance: number
}

export const BANKUSER_PLACEHOLDER: BankUser = {uid: "", isBanker: false, balance: 0};