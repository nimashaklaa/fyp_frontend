import './chatList.css'
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

interface Chat {
    _id:string;
    title:string;
}
const ChatList =()=>{

    const {isPending,error,data}=useQuery<Chat[]>({
        queryKey:['userChats'],
        queryFn:()=> fetch(`${import.meta.env.VITE_API_URL}/api/userChats`,
            {
                credentials:"include"
            }
            ).then((res)=>res.json())
    })

    return(
        <div className="chatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/dashboard">Explore Journee AI</Link>
            <Link to="/dashboard">Contact</Link>

            <hr/>
            <span className="title">RECENT CHATS</span>
            <div className="list">
                {
                    isPending
                        ?"Loading ..."
                        :error
                            ?"Something went wrong"
                            :data.map((chat: Chat)=>(
                             <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}</Link>
                            ))
                }
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