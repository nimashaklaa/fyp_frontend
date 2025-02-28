import './dashboardPage.css'
import React from "react";
import {useAuth} from "@clerk/clerk-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

const DashboardPage =()=>{

    const {userId} = useAuth()

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: async (text:string)=>{
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "POST",
                credentials:"include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, text })
            }).then((res)=>res.json())
        },
        onSuccess:(id)=>{
            queryClient.invalidateQueries({queryKey:["userChats"]})
            navigate(`/dashboard/chats/${id}`)
        }
    })

    const handleSubmit= async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const text = (form.elements.namedItem("text") as HTMLInputElement)?.value;
        console.log(text,userId)
        if(!text) return

        mutation.mutate(text)
    }
    return(
        <div className='dashboardPage'>
            <div className="texts">
                <div className="logo">
                    <img src="/logo.png" alt=""/>
                    <h1>Journee AI</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt=''/>
                        <span>Create a new Chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt=''/>
                        <span>Explore Destinations</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt=''/>
                        <span>Smart Itinerary</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" placeholder="Plan your next trip..."/>
                    <button>
                        <img src="/arrow.png" alt=""/>
                    </button>
                </form>
            </div>
        </div>
    )
}
export default DashboardPage;