export interface QuizQuestion{
    name: string; //question title

    body: string; //more details about the question

    picture_url: string;

    points: number; //number of points the question is worth

    options: [string, boolean][]; //answer options paired with whether they're correct or not
}

export function default_quizquestion(): QuizQuestion {
    return {
        name: "",
        body: "",
        picture_url: "",
        points: 0,
        options: [],
    }
}

export function resolve_nullish_quizquestion(q: QuizQuestion): QuizQuestion {
    return {
        name: q.name ?? "",
        body: q.body ?? "",
        picture_url: q.picture_url ?? "",
        points: q.points ?? "",
        options: q.options ?? []
    }
}