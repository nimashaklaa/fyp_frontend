import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
        userId:{
            type:String,
            required:true
        },
        history:[
            {
                role:{
                    type:String,
                    enum:["user","model"],
                    required:true,
                },
                parts:[
                    {
                        text:{
                            type:String,
                            required:true,
                        }
                    }
                ],
                img:{
                    type:String,
                    required:false,
                }
            }
        ],
        plans:[
            {
                version:{
                    type:Number,
                    required:true
                },
                initialPrompt:{
                    type:String,
                    required:true,
                },
                feedback:{
                    type:String,
                    default:null
                },
                updatedPlan:{
                    type:String,
                    required:true,
                },
                timestamp:{
                    type:Date,
                    default:Date.now
                }
            }
        ]

    },
    {timestamps:true})

export default mongoose.models.chat || mongoose.model('chat',chatSchema)