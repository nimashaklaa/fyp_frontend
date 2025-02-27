import './chatList.css'
import {Link} from "react-router-dom";

const ChatList =()=>{
    return(
        <div className="chatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/dashboard">Explore Journee AI</Link>
            <Link to="/dashboard">Contact</Link>

            <hr/>
            <span className="title">RECENT CHATS</span>
            <div className="list">
                <Link to="/">My chat title</Link>

            </div>

            <hr/>
            <div className="upgrade">
                <img src="/logo.png" alt=""/>
                <div className="text">
                    <span>Upgrade to Journee AI Pro</span>
                    <span>Get Unlimited access to all features</span>
                </div>
            </div>

        </div>
    )
}
export default ChatList