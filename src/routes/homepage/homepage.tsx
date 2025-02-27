import './homepage.css'
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {TypeAnimation} from "react-type-animation";

const Homepage: React.FC =()=>{

    const [typingStatus, setTypingStatus] = useState('human1')

    return(
        <div className='homepage'>
            <img src='/orbital.png' alt="oebital" className="orbital"/>
            <div className="left">
                <h1>Journee AI</h1>
                <h2>Personalized Itineraries Tailored Just for You</h2>
                <h3>Smart Planning That Understands Your Interests & Schedules</h3>
                <Link to="/dashboard">
                    Get Started
                </Link>
            </div>
            <div className="right">
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg"></div>
                    </div>
                    <img src="/bot.png" alt="bot" className="bot"/>
                    <div className="chat">
                        <img src={typingStatus==="human1" ? "/human1.jpeg":"/bot.png"} alt="human" className="human"/>
                        <TypeAnimation
                            sequence={[
                                'User: Plan my next vacation to Japan!',1000,()=>{
                                setTypingStatus("bot")
                                },
                                "Bot: Sure!, I’ll craft a personalized itinerary focusing on Kyoto's temples and Osaka's street food.",1000,()=>{
                                    setTypingStatus("human1")
                                },
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt="logo"/>
                <div className="links">
                    <Link to="/">Terms of Service</Link>
                    <span>|</span>
                    <Link to="/">Privacy and Policy</Link>
                </div>
            </div>

        </div>
    )
}
export default Homepage;