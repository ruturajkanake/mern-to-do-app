const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// Dont need to include for development 

const path = require('path')

if(process.env.NODE_ENV === 'production'){
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); //relative path
    })
}

// app.use('/',userRouter)
// app.use('/',taskRouter)

// end;


// New changes
const cookieParser = require('cookie-parser')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

module.exports = app

