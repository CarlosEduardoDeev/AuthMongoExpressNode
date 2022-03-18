const mongoose = require('mongoose')

//credenciaios vindas do .ENV

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS



const connectMongoose = mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.eus3n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)

module.exports = connectMongoose