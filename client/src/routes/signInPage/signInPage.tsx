import './signInPage.css'
import React from "react";
import {SignIn} from "@clerk/clerk-react";

const SignInPage: React.FC =()=>{
    return(
        <div className='signInPage'>
            <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard"/>
        </div>
    )
}
export default SignInPage;