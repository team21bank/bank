


export interface QuizResult {
    quiz: string, //id of the quiz this result is for
    attempts: number[] //number of correct answers for each attempt
}

//quiz taking eligibility is determined by checking whether the length of 
//the attempts array is greater than the maximum number of allowed attempts

export function resolve_nullish_quizresult(r: QuizResult): QuizResult {
    return {
        quiz: r.quiz ?? "",
        attempts: r.attempts ?? []
    }
}

//Making default a function since we had issues with default interface objects being modified despite being const because of shallow copying
export function default_quizresult(): QuizResult {
    return {
        quiz: "",
        attempts: []
    }
}