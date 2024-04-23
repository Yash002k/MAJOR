import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from 'react';
import speech, { useSpeechRecognition } from 'react-speech-recognition';
import "regenerator-runtime";
import { apikey } from "./config";


export const ChatBotAi = () => {
    const {
        listening,
        transcript,
    } = useSpeechRecognition();

    const [thinking, setThinking] = useState(false);

    const [aiText, setAiText] = useState("");

    async function callGpt3API(message: string) {

        setThinking(true)

        const data = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // sk-proj-yBOpbzLrya5NkVu2T5vpT3BlbkFJz7j2YUbHUHNnB90rqxYw
                Authorization: `Bearer ${apikey}`,
            },
            body: JSON.stringify({
                message: [{
                    role: "user",
                    content: message
                },
                ],
                model: "gpt-3.5-turbo"
            }),
        }).then((res) => res.json());

        console.log("Response from OpenAI API:", data);
        setThinking(false)

        return data?.choices?.[0]?.message?.content ?? "No content available";
        // return data.choices[0].message.content;

    }

    useEffect(() => {
        if (!listening && transcript) {
            callGpt3API(transcript).then((response) => {
                const speechSynthesis = window.speechSynthesis;
                const utterance = new SpeechSynthesisUtterance(response);
                speechSynthesis.speak(utterance);
                setAiText(response);
            });
        }
    }, [transcript, listening])

    return (
        <>
            <div className="absolute bottom-10 right-2 bg-white rounded-md px-1.5 h-320 flex-col items-center shadow-md w-[400px]"
            style={{ backgroundColor: '#a8dadc', fontFamily: 'monospace', fontSize: 'large' }}
            >
                {
                    listening ? (
                        <p>LISTENING</p>
                    ) : (
                        <p>
                            ASK ME ANYTHING
                        </p>
                    )
                }
                <Button style={{ marginBottom: '10px' }} onClick={() => {
                    speech.startListening();
                }}>
                    CLICK ME!
                </Button>
                {
                    transcript && <div>{transcript}</div>
                }
                {
                    thinking && <div>Thinking...</div>
                }
                {
                    aiText && <div>{aiText}</div>
                }
            </div>
        </>
    );
};
