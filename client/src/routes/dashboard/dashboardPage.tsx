import './dashboardPage.css'
import React from "react";

const DashboardPage: React.FC =()=>{
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
                        <span>Analyze Images</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt=''/>
                        <span>Help me with my Code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form>
                    <input type="text" placeholder="Plan your next trip..."/>
                    <button>
                        <img src="/arrow.png" alt=""/>
                    </button>
                </form>
            </div>
        </div>
    )
}
export default DashboardPage;