export interface Subgroup {
    name: string
    studentList: string[]
}

export const SUBGROUPS_PLACEHOLDER: Subgroup = { name: "placeholder", studentList: ["placeholder"] };


export function resolve_nullish_subgroup(s: Subgroup): Subgroup {
    return {
        name: s.name ?? "",
        studentList: s.studentList ?? []
    }
}
