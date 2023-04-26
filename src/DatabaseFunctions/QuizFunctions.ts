import { get, getDatabase, ref, remove, set } from "firebase/database";
import { Quiz, default_quiz, resolve_nullish_quiz } from "../Interfaces/Quiz";

/**
 * 
 * @param quiz Quiz object to write to the database
 * @param id Optional ID of where to write the quiz object
 * 
 * @returns the code under which the new quiz was stored in the database
 */
export async function create_new_quiz(quiz: Quiz): Promise<string> {
    let code = createCode(12);
    let reference = ref(getDatabase(), "/quizzes/"+code);
    while((await get(reference)).exists() == true) {
        code = createCode(12);
        reference = ref(getDatabase(), "/quizzes/"+code);
    }
    set(reference, {...quiz, hash: code});
    return code;
}

export async function update_quiz(quiz: Quiz) {
    if(quiz.hash==="") {
        return Promise.reject("Invalid quiz");
    }
    let reference = ref(getDatabase(), "/quizzes/"+quiz.hash);
    await set(reference, quiz);
    return;
}


export async function get_quiz(id: string): Promise<Quiz> {
    let snapshot = await get(ref(getDatabase(), "/quizzes/"+id));
    if(snapshot.exists() == false) {
        Promise.reject("Quiz not found");
    }
    return resolve_nullish_quiz(snapshot.val());
}


export async function delete_quiz(id: string): Promise<void> {
    if(id==="") {
        return Promise.reject("Invalid quiz id");
    }

    await remove(ref(getDatabase(), "/quizzes/"+id));
    return;
}

/**
 * 
 * @param ids ids referencing quiz objects
 * 
 * Quizzes that do not exist will be the default quiz object
 */
export async function get_quizzes(ids: string[]): Promise<Quiz[]> {
    let result: Quiz[] = []
    for(let id of ids) {
        try {
            result.push(await get_quiz(id))
        } catch {
            result.push(default_quiz())
        }
    }
    return result;
}



const characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
function createCode(length: number): string {
    if(length<0) {length=length*-1}    
    let code = ""
    for (var i=0;i<length;i++){
        code+=characters.charAt(Math.floor(Math.random()*characters.length))
    }
    return code;
}