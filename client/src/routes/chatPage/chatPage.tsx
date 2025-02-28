import './chatPage.css'
import React from "react";
import NewPrompt from "../../components/newPrompt/newPrompt.tsx";

const ChatPage: React.FC =()=>{

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
                    <NewPrompt/>

                </div>
            </div>
        </div>
    )
}
export default ChatPage;