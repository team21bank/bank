export interface QuizQuestion{
    id: number; //unique id for the question; useful for deleting questions

    name: string; //question title

    body: string; //more details about the question

    points: number; //question points


    options: [string, boolean][]; //options exist if MultipleChoice type
}

export function default_quizquestion(): QuizQuestion {
    return {
        id: 0,
        name: "",
        body: "",
        points: 0,
        options: [],
    }
}
