const app = require('./app')
const port = process.env.PORT
const path = require('path')

if(process.env.NODE_ENV === 'production'){
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); //relative path
    })
}

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

