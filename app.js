require('dotenv').config()

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//Models

const User = require('./Models/User')


const app = express ();

//Configuraçao json response

app.use(express.json());

//credenciaios vindas do .ENV

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS



app.post('/auth/register', async (req,res) =>{

    const {name,email,password,confirmpassword} = req.body

    //validations 

    if(!name){
        return res.status(422).json({msg:"O nome é obrigatorio"})
    }
    if(!email){
        return res.status(422).json({msg:"O email é obrigatorio"})
    }
    if(!password){
        return res.status(422).json({msg:"A senha é obrigatorio"})
    }
    if(password !== confirmpassword){
        return res.status(422).json({msg:"As senhas nao sao iguais"})
    }

})

app.get("/",(req, res) =>{
    res.status(200).json({msg:"Bem vindo a nossa api"})
})


//conect com o banco 
mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.eus3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    
    ).then(() =>{
    app.listen(3000)
    console.log("conected");
}).catch((err) => console.log(err))