
export interface AuthUser {
    email: string
    username: string
    id: string
    avatar: string
    groups: string[]
    isTeacher: boolean
    hash: string
}
export const DEFAULT_AUTH_USER: AuthUser = {
    email: "", username: "", id: "", avatar: "", groups: [], isTeacher: false, hash: ""
} 