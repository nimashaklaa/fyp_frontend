import './chatPage.css'
import React, {useEffect, useRef} from "react";

const ChatPage: React.FC =()=>{

    // this is used to automatically scroll down to the end of the chat
    const endRef =useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior:"smooth"})
    }, []);

    return(
        <div className='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div className="message">Test msg from ai</div>
                    <div className="message user">Test msg from user</div>
                    <div ref={endRef}/>
                </div>
            </div>
        </div>
    )
}
export default ChatPage;