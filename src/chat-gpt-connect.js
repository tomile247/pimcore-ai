import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true
});

export function sendRequest(message, model) {
    return openai.chat.completions.create({
        model: model,
        // web_search_options: {},
        messages: [
            {
                "role": "system",
                "content": "You are a helpful assistant that responds with required product attributes data."
            },
            {
                "role": "user",
                "content": message
            },
        ],
    });
}