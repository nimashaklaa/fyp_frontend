import './newPrompt.css'
import {useEffect, useRef, useState} from "react";
import Upload from "../upload/upload.tsx";
import {IKImage} from "imagekitio-react";

export interface ImgState {
    isLoading: boolean; // Indicates if an image upload is in progress
    error: string; // Stores an error message if upload fails
    dbData: Record<string, any>; // Holds uploaded image data
}

const NewPrompt=()=>{

    const [img,setImg]= useState<ImgState>({isLoading:false,error:"",dbData:{}})
    // this is used to automatically scroll down to the end of the chat
    const endRef =useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({behavior:"smooth"})
    }, []);

    return(
        <>
            {img.isLoading && <div className="loading">Loading ....</div>}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width={380}
                    transformation={[{width:"380"}]}
                />
            )}
            <div className="endChat" ref={endRef}></div>
            <form className="newPrompt">
                <Upload setImg={setImg}/>
                <input id="file" type="file"  multiple={false} hidden/>
                <input type="text" placeholder="Plan your next trip..."/>
                <button>
                    <img src="/arrow.png" alt=""/>
                </button>
            </form>
        </>
    )
}
export default NewPrompt;