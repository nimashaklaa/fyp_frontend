import express, {NextFunction,Request,Response} from "express"
import ImageKit from "imagekit";
import dotenv from 'dotenv';
import cors from 'cors';
import * as mongoose from "mongoose";
import Chat from "./models/chat";
import UserChats from "./models/userChats";
import {AuthObject, clerkMiddleware, requireAuth} from "@clerk/express";

interface AuthRequest extends Request{
    auth:AuthObject;
}

dotenv.config();

const port = process.env.PORT || 3000
const app = express()

app.use(cors({
    // origin:process.env.CLIENT_URL
    origin:"http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))

app.use(express.json())
app.use(clerkMiddleware());

const connect = async ()=>{
    try{
        const mongoUrl = process.env.MONGO_DB_URL
        if (!mongoUrl) {
           console.error("MONGO_DB_URL is not defined in environment variables.");
           process.exit(1)
        }
        await mongoose.connect(mongoUrl)
        console.log("connected to DB! ✅")
    }catch (error:any){
        console.log(error)
        process.exit(1)
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT as string,
    publicKey:process.env.VITE_IMAGE_KIT_PUBLIC_KEY as string,
    privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY as string
})

app.get("/api/upload",(req,res)=>{
    const result = imagekit.getAuthenticationParameters()
    res.json(result)
})

app.get("/api/test",requireAuth(),(req,res)=>{
    const authRequest = req as AuthRequest; // Cast req to AuthRequest
    const userId = authRequest.auth.userId;
    console.log(userId)
    res.send("Success!")
})

app.post("/api/chats",
    requireAuth(),
    async (req,res)=>{
        const authRequest = req as AuthRequest; // Cast req to AuthRequest
        const userId = authRequest.auth.userId;
        console.log(req.body)
        const {text} = req.body

        try{
            //create a new chat
            const newChat = new Chat({
                userId:userId,
                history:[{role:"user",parts:[{text}]}]
            })
            const savedChat = await newChat.save()

            // check if the user chats exist
            const userChats = await  UserChats.findOne({userId:userId})
            // if it does not exist create a new one and add the chat in the chat array
            if(!userChats){
                const newUserChats = new UserChats({
                    userId:userId,
                    chats:[
                        {
                            _id:savedChat.id,
                            title: text.substring(0,40)
                        }
                    ]
                })
                await newUserChats.save()
            }else{
                //if exists,push the chat to the existing array
                await UserChats.updateOne({userId:userId},{
                    $push:{
                        chats:{
                            _id:savedChat._id,
                            title:text.substring(0,40)
                        }
                    }
                })

            }
            res.status(201).send(newChat._id)

        }catch(error:any){
            console.log(error)
            res.status(500).send("Error creating chat!")
        }
})

app.get("/api/userChats",requireAuth(),async (req,res)=>{
    const authRequest = req as AuthRequest; // Cast req to AuthRequest
    const userId = authRequest.auth.userId;
    try{
        const userChats = await UserChats.find({userId})
        res.status(200).send(userChats[0]?.chats || []);

    }catch(err){
        console.log(err)
        res.status(500).send("Error fetching chat! ")
    }
})

app.get("/api/chats/:id",requireAuth(),async (req,res)=>{
    const authRequest = req as AuthRequest;
    const userId = authRequest.auth.userId;
    try{
        const chat = await Chat.findOne({_id:req.params.id,userId})
        res.status(200).send(chat);

    }catch(err){
        console.log(err)
        res.status(500).send("Error fetching chat! ")
    }
})


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
});

app.listen(port, async () => {
    try {
        await connect();
        console.log("Server running on port", port);
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
});
