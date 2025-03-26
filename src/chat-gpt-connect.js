import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true
});

export function sendRequest(message, model) {
    return openai.chat.completions.create({
        model: model,
        messages: [
            {
                "role": "system",
                "content":
                        `You are an AI assistant that provides structured JSON responses. 
                        Reply only in the following format without any extra text or backticks:
                        {
                            "EAN": "<ean_value>",                            
                            "attributes": {
                                "<attribute_name>": { "value": "<attribute_value>", "multiple": <true_or_false> }
                            },                            
                        }`
            },
            {
                "role": "user",
                "content": message
            },
        ],
    });
}
