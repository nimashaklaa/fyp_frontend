import './signUpPage.css'
import React from "react";
import {SignUp} from "@clerk/clerk-react";

const SignUpPage: React.FC =()=>{
    return(
        <div className='signUpPage'>
            <SignUp path="/sign-up" signInUrl="/sign-in"/>
        </div>
    )
}
export default SignUpPage;