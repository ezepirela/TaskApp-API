const   express             =   require('express'),
        dotenv              =   require('dotenv').config(),
        app                 =   express(),
        userRoutes          =   require('./Routes/user'),
        tasksRoutes         =   require('./Routes/tasks'); 
        require('./mongoose');

app.use(express.json());
app.use('/user', userRoutes);
app.use('/tasks', tasksRoutes);
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    };
    res.status(404).send({error: error.message})
})
app.listen(process.env.PORT, () => {
    console.log('app running')
})