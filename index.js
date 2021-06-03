const   app       =   require('./app'),
        dotenv    =   require('dotenv').config();
        

app.listen(process.env.PORT, () => {
    console.log('app running')
})