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

export function extractButtonFromHtml(markdown: string) {
    const buttonRegex = /<button\s+onclick=["']createTicket\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)["']\s*>([^<]+)<\/button>/i;
    const match = markdown.match(buttonRegex);

    if (match) {
        const [, category, title, description, label] = match;
        const cleanedMarkdown = markdown.replace(buttonRegex, "").trim();

        return {
            category,
            title,
            description,
            label,
            cleanedMarkdown
        };
    }

    return null;
}
