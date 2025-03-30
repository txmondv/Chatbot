interface ThoughtProccess {
    thoughts: string | null;
    answer: string;
}

export const extractThoughtProcess = (message: string): ThoughtProccess  => {
    const thinkRegex = /<think>([\s\S]*?)<\/think>/;
    const match = message.match(thinkRegex);
    
    const returnObj: ThoughtProccess = {
        thoughts: null,
        answer: message.trim()
    }

    if (match) {
        returnObj.thoughts = match[1];
        returnObj.answer = message.replace(thinkRegex, "").trim();
    } 

    return returnObj;
}