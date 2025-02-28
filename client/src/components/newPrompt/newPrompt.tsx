import './newPrompt.css'
import React, {useEffect, useRef, useState} from "react";
import Upload from "../upload/upload.tsx";
import {IKImage} from "imagekitio-react";
import model from "../../lib/gemini.ts";
import Markdown from "react-markdown";
import {Part} from "@google/generative-ai";

export interface ImgState {
    isLoading: boolean; // Indicates if an image upload is in progress
    error: string; // Stores an error message if upload fails
    dbData: Record<string, any>; // Holds uploaded image data
    aiData: Record<string, any>; // Holds uploaded image data
}

const NewPrompt=()=>{

    const [img,setImg]= useState<ImgState>({isLoading:false,error:"",dbData:{},aiData:{}})
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")

    const chat = model.startChat({
        history:[
            {
                role:"user",
                parts:[{text:"Hello, I have 2 dogs in my house"}],
            },
            {
                role:"model",
                parts:[{text: "Great!. What do you need to know?"}]
            }
        ],
        generationConfig:{
            // maxOutputTokens:100
        }
    })

    // this is used to automatically scroll down to the end of the chat
    const endRef =useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior:"smooth"})
    }, [question, answer, img.dbData]);

    const add = async (prompt:string)=>{
        setQuestion(prompt)
        try {
            // Ensure aiData is properly formatted as a `Part` if it exists
            const inputParts: (string | Part)[] = Object.keys(img.aiData).length
                ? [{ inlineData: img.aiData.inlineData }, prompt] // Convert to correct type
                : [prompt];

            const result = await chat.sendMessageStream(inputParts)
            let accumulatedText =""
            for await (const chunk of result.stream){
                const chunkText = chunk.text()
                console.log(chunkText)
                accumulatedText+=chunkText
                setAnswer(accumulatedText);
            }
            setImg({isLoading:false, error:"",dbData:{},aiData:{}})
        } catch (error) {
            console.error("Error fetching response:", error);
            setAnswer("Error: Unable to generate response.");
        }
    }
    const handleSubmit=async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const text = (e.currentTarget.elements.namedItem("text") as HTMLInputElement)?.value;
        if (!text) return;

        add(text)

    }

    return(
        <>
            {img.isLoading && <div className="loading">Loading ....</div>}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width={380}
                    transformation={[{width:"380"}]}
                />
            )}
            {question && (<div className="message user">{question}</div>)}
            {answer && (<div className="message"><Markdown>{answer}</Markdown></div>)}
            <div className="endChat" ref={endRef}></div>
            <form className="newPrompt" onSubmit={handleSubmit}>
                <Upload setImg={setImg}/>
                <input id="file" type="file"  multiple={false} hidden/>
                <input type="text" name="text" placeholder="Plan your next trip..."/>
                <button>
                    <img src="/arrow.png" alt=""/>
                </button>
            </form>
        </>
    )
}
export default NewPrompt;