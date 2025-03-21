import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true
});

export function sendRequest(message) {
    return openai.chat.completions.create({
        model: "gpt-4o-search-preview",
        web_search_options: {},
        messages: [
            {"role": "user", "content": message},
        ],
    });
}