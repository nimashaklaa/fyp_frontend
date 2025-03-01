import './chatPage.css'
import NewPrompt from "../../components/newPrompt/newPrompt.tsx";
import {useQuery} from "@tanstack/react-query";
import {useLocation} from "react-router-dom";
import Markdown from "react-markdown";
import {IKImage} from "imagekitio-react";
import React from 'react';

export interface ChatMessage {
    role: string;
    parts: { text: string }[];
    img:string
}


const ChatPage =()=>{

    const path = useLocation().pathname
    const chatId = path.split("/").pop()

    const {isPending,error,data}=useQuery<{ _id?: string; history: ChatMessage[] }>({
        queryKey:['chat',chatId],
        queryFn:()=> fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
            {
                credentials:"include"
            }
        ).then((res)=>res.json())
    })

    return(
        <div className='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    {isPending?"Loading...":error?"Something went wrong":
                    data?.history?.map((message)=>(
                        <React.Fragment key={Math.random()}>
                            {message.img &&(
                                <IKImage
                                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                path={message.img}
                                height="300"
                                width="400"
                                transformation={[{ height: "300", width: "400" }]}
                                loading="lazy"
                                lqip={{active:true,quality:20}}
                                />
                            )}
                            <div className={message.role==="user"?"message user":"message"} >
                                <Markdown>{message.parts[0].text.replace(/\n/g, "  \n")}</Markdown>
                            </div>
                        </React.Fragment>
                    ))
                    }
                    {data && <NewPrompt data={data}/>}
                </div>
            </div>
        </div>
    )
}
export default ChatPage;