const app = require('./app')
const port = process.env.PORT || 5000

// Don't need to include this for development


// end;

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

