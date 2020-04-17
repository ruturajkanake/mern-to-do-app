const app = require('./app')
const port = process.env.PORT || 5000

// Don't need to include this for development
const path = require('path')

if(process.env.NODE_ENV === 'production'){
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); //relative path
    })
}

// end;

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

