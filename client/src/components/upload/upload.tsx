import {IKContext, IKUpload} from "imagekitio-react";
import {ImgState} from "../newPrompt/newPrompt.tsx";
import React, {useRef} from "react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY

const authenticator = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/upload");

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        // ✅ Ensure response contains required fields
        if (!data.signature || !data.expire || !data.token) {
            throw new Error("Invalid authentication response from server.");
        }

        return data; // ✅ Returns `{ signature, expire, token }`
    } catch (error: any) {
        console.error("Authentication Error:", error);
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

interface UploadProps {
    setImg: React.Dispatch<React.SetStateAction<ImgState>>;
}
const Upload =({setImg}:UploadProps)=>{

    const ikUploadRef = useRef<HTMLInputElement | null>(null)

    const onError= (err:any)=>{
        console.log("Error",err)
    }
    const onSuccess= (res:any)=>{
        console.log("Success",res)
        setImg(prev=>({...prev,isLoading:false, dbData:res}))
    }
    const onUploadProgress=(progress:any)=>{
        console.log("Progress",progress)
    }
    const onUploadStart=(evt:any)=>{
        console.log("start",evt)
        setImg(prev=>({...prev,isLoading:true}))
    }
    return(
        <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
            <IKUpload fileName="test-upload.png" onError={onError} onSuccess={onSuccess} useUniqueFileName={true} onUploadProgress={onUploadProgress} onUploadStart={onUploadStart} style={{display:"none"}} ref={ikUploadRef}/>
            <label onClick={()=>ikUploadRef.current?.click()}>
                <img src="/attachment.png" alt=""/>
            </label>
        </IKContext>
    )
}
export default Upload