
export interface AuthUser {
    email: string
    username: string
    id: string
    avatar: string
    groups: string[]
    isTeacher: boolean
    hash: string
    quizzes: string[]
}
export const DEFAULT_AUTH_USER: AuthUser = {
    email: "", username: "", id: "", avatar: "", groups: [], isTeacher: false, hash: "", quizzes: []
} 

export function default_authuser(): AuthUser {
    return {
        email: "",
        username: "",
        id: "",
        avatar: "", 
        groups: [],
        isTeacher: false,
        hash: "",
        quizzes: []
    }
}

export function resolve_nullish_authuser(user: AuthUser): AuthUser {
    return {
        email: user.email ?? "",
        username: user.username ?? "",
        id: user.id ?? "",
        avatar: user.avatar ?? "",
        groups: user.groups ?? [],
        isTeacher: user.isTeacher ?? false,
        hash: user.hash ?? "",
        quizzes: user.quizzes ?? []
    }
}