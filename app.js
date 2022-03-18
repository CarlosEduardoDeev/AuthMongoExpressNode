require('dotenv').config()

const connectMongoose = require('./ConnectDB/ConnectDB')

const express = require("express")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

//Models

const User = require('./Models/User')

//atribuindo express para o app

const app = express ();

//Configuraçao express para ler json

app.use(express.json());

// Rota privada
app.get("/user/:id", async (req, res) => {
    const id = req.params.id;
  
    // check if user exists
    const user = await User.findById(id, "-password");
  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
  
    res.status(200).json({ user });
  });
  


//Post para criar Usuario

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
    // if para ver se a senha confere

    if(password !== confirmpassword){
        return res.status(422).json({msg:"As senhas nao sao iguais"})
    }
    // if utilizado para checar se email ja existe

    const userExist =  await User.findOne({email: email })
    
    if(userExist){
        return res.status(422).json({msg:"Por favor use outro email "})
    }



    
    //Create senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)




    //Create usuario
    const user = new User({
        name,
        email,

     //atribuindo dificuldade a senha 
        password:passwordHash,
    })
        try{
            await user.save()

            res.status(201).json({msg: 'Usuario Criado com sucesso! '})
            
        }catch(error){
            res.status(500).json({
                msg:'Erro de servidor tente mais tarde'
            })
        }
})


    //Login no servidor
    app.post("/auth/login", async (req, res) =>{

        const {email,password} = req.body

        if(!email){
            return res.status(422).json({msg:"O email é obrigatorio"})
        }
        if(!password){
            return res.status(422).json({msg:"A senha é obrigatorio"})
        }
        

        //verificando se o Login existe 
        const user =  await User.findOne({email: email });
        
    

        // Checando se a Usario contem no banco 
        if(!user){
        return res.status(404).json({msg:"Usario nao encontrado  "})
        }
        
        
        // verificando se o password combina
        const checkPassword = await bcrypt.compare(password, user.password)
        
        if(!checkPassword){
            return res.status(422).json({msg: "Senha inválida!"})
        }

        try{
            const secret = process.env.SECRET  
            
            const token = jwt.sign(
                
                {
                id: user._id,
                },
                    secret,
            
            )

            res.status(200).json({msg: "Login feito com sucesso !", token})

            }catch (error){
            res.status(500).json({
                msg:'Erro de servidor tente mais tarde'
            })

        }

    
    })








//conect  com o banco 

connectMongoose.then(() => {
    app.listen(3000,
        console.log('connect')
    )
})





//teste com resposta de acessando API

app.get("/",(req, res) =>{
    res.status(200).json({msg:"Bem vindo a nossa api"})
})





