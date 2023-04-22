
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

export function resolve_nullish_authuser(user: AuthUser): AuthUser {
    return {
        email: user.email ?? DEFAULT_AUTH_USER.email,
        username: user.username ?? DEFAULT_AUTH_USER.username,
        id: user.id ?? DEFAULT_AUTH_USER.id,
        avatar: user.avatar ?? DEFAULT_AUTH_USER.avatar,
        groups: user.groups ?? DEFAULT_AUTH_USER.groups,
        isTeacher: user.isTeacher ?? DEFAULT_AUTH_USER.isTeacher,
        hash: user.hash ?? DEFAULT_AUTH_USER.hash
    }
}