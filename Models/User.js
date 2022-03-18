//importando o mongoose, tendo acesso aos metados 

const mongoose = require('mongoose')


// Lugar onde eu monto o modelo de usuario
const User = mongoose.model('User',{

    name: String,
    email: String,
    password:String,
})

module.exports = User