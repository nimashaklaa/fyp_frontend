import express from "express"
import ImageKit from "imagekit";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 3000
const app = express()

app.use(cors({
    // origin:process.env.CLIENT_URL
    origin:"http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))


const imagekit = new ImageKit({
    urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT as string,
    publicKey:process.env.VITE_IMAGE_KIT_PUBLIC_KEY as string,
    privateKey: process.env.VITE_IMAGE_KIT_PRIVATE_KEY as string
})
console.log("ImageKit Credentials:");
console.log("URL Endpoint:", process.env.VITE_IMAGE_KIT_ENDPOINT);
console.log("Public Key:", process.env.VITE_IMAGE_KIT_PUBLIC_KEY);
console.log("Private Key:", process.env.VITE_IMAGE_KIT_PRIVATE_KEY ? "Loaded" : "MISSING!");

app.get("/api/upload",(req,res)=>{
    const result = imagekit.getAuthenticationParameters()
    res.json(result)
})

app.listen(port,()=>{
    console.log("server running on 3000")
})