

import mongoose from "mongoose";




const adminSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },  
    email:{
        type:String,
        sparse:true,
        unique:true,
    },
    identityNumber:{
        type:String,
        unique:true, 
        sparse:true,
    },
    phone:{
        type:String,
        unique:true,
        sparse:true,
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator:(value)=>{
                return String(value).length >= 8 
            },
            message:"البسورد يجب ان يكون علي الاقل 8 احرف"
        }
    },
    rule:{
        type:String,
        enum:["manager","reviewer","committee"],
        required:true,
    },
    
},{
 timestamps:true   
})


 const Admin = mongoose.model("q3wanAdmin",adminSchema)

 export default Admin   