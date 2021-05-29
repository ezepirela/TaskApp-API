const   mongoose            =   require('mongoose'),
        express             =   require('express'),
        app                 =   express(),
        connectionUrl       =   'mongodb://127.0.0.1:27017',
        databaseName        =   'task_manager_api',
        userRoutes          =   require('./Routes/user'),
        tasksRoutes         =   require('./Routes/tasks');
mongoose.connect(`${connectionUrl}/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('db running'))
.catch(e => console.error('error', e.message));
app.use(express.json());
app.use('/user', userRoutes);
app.use('/tasks', tasksRoutes);
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    };
    res.status(404).send({error: error.message})
})
app.listen(3000, () => {
    console.log('app running')
})