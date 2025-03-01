import './newPrompt.css'
import React, {useEffect, useRef, useState} from "react";
// import Upload from "../upload/upload.tsx";
import {IKImage} from "imagekitio-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ChatMessage} from "../../routes/chatPage/chatPage.tsx";
import Markdown from "react-markdown";

export interface ImgState {
    isLoading: boolean; // Indicates if an image upload is in progress
    error: string; // Stores an error message if upload fails
    dbData: Record<string, any>; // Holds uploaded image data
    aiData: Record<string, any>; // Holds uploaded image data
}

interface NewPromptProps{
    data?:{
        _id?:string;
        history:ChatMessage[];
        plans?:{
            version: number;
            initialPrompt: string;
            feedback?: string;
            updatedPlan: string;
        }[]
    }
}

const NewPrompt=({data}:NewPromptProps)=>{

    const [img,setImg]= useState<ImgState>({isLoading:false,error:"",dbData:{},aiData:{}})
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // this is used to automatically scroll down to the end of the chat
    const endRef =useRef<HTMLDivElement | null>(null)
    const formRef =useRef<HTMLFormElement | null>(null)

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn:async ({ question, answer, img }: { question: string; answer: string; img?: string })=>{
            if (!data || !data.history.length) {
                throw new Error("No chat history available");
            }
            const chatId = data?._id;
            console.log("chatId", chatId)
            if (!chatId) {
                console.error("Chat ID is missing!");
                return;
            }
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
                method: "PUT",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question:question.length?question:undefined,
                    answer:answer||"AI response not available",
                    img:img || undefined
                })
            }).then((res)=>res.json())
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["chat",data?._id]}).then(()=>{
                if(formRef.current){
                    formRef.current.reset()
                }
                setQuestion("")
                setIsTyping(false)
                setImg({isLoading:false,error:"",dbData:{},aiData:{}})
            })
        },
        onError:(err)=>{
            console.log(err)
            setIsTyping(false)
        }
    })

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior:"smooth"})
    }, [question, answer, img.dbData]);

    const add = async (prompt:string, isInitial:boolean)=>{
        if (!isInitial) setQuestion(prompt)

        setIsTyping(true)
        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: prompt }), // Send user input
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json(); // Parse the response

            if (!data.message) {
                throw new Error("Invalid response structure");
            }
            setAnswer(prev => (prev === data.message ? prev : data.message));

            mutation.mutate({
                question: prompt,
                answer: data.message, // ✅ Use the received AI response directly
                img: img.dbData?.filePath || undefined // ✅ Ensure correct data is passed
            });
        } catch (error) {
            console.error("Error fetching response:", error);
            setAnswer("Error: Unable to generate response.");
        }finally {
            setIsTyping(false);
        }
    }

    const updatePlan = async (feedback: string, choice: number) => {
        if (!data?._id) {
            console.error("❌ Chat ID is missing. Cannot update plan.");
            return;
        }

        const lastPlan = data.plans?.[data.plans.length-1]

        setIsTyping(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/update_plan/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feedback, original_plan: lastPlan?.updatedPlan ?? "No previous plan",choice }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedData = await response.json();
            console.log("updated response",updatedData)
            setAnswer(updatedData.updatedPlan);
        } catch (error) {
            console.error("Error fetching response:", error);
            setAnswer("Error: Unable to generate response.");
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmit=async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const text = (e.currentTarget.elements.namedItem("text") as HTMLInputElement)?.value;
        if (!text) return;

        if(!data || !data.history.length){
            console.log("Now you are handling a new plan")
            add(text,false)
        }else{
            console.log("Now you are handling an feedback plan")
            updatePlan(text,selectedOption??5)
        }
    }
    //If you don't need to run this twice as the root layout is in strict mode use effects run twice to find any possible bug, in production this does not need
    const hasRun = useRef(false)
    useEffect(() => {
        if (!hasRun.current && data?.history?.length === 1) {
            add(data.history[0].parts[0].text, true);
            hasRun.current = true;
        }
    }, [data]);

    console.log("answer",answer)

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
            {isTyping ? (
                <div className="typing-container">
                    <span className="typing-animation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </div>
            ) : (
                answer && (
                    <div className="message">
                        <Markdown>{answer.replace(/\n/g, "  \n")}</Markdown> {/* ✅ Preserve line breaks */}
                    </div>
                )
            )}

            {/* Selection Dropdown for Iterative Feedback */}
            {data && data.history.length > 0 && (
                <div className="feedback-section">
                    <label>Select what to update:</label>
                    <select value={selectedOption ?? ""} onChange={(e) => setSelectedOption(Number(e.target.value))}>
                        <option value="1">Transportation</option>
                        <option value="2">Accommodation</option>
                        <option value="3">Attractions</option>
                        <option value="4">Restaurants</option>
                        <option value="5">All of the above</option>
                    </select>
                </div>
            )}

            <div className="endChat" ref={endRef}></div>
            <form className="newPrompt" onSubmit={handleSubmit} ref={formRef}>
                {/*<Upload setImg={setImg}/>*/}
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