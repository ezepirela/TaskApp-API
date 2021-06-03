const mongoose            = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ai1xb.mongodb.net/${process.env.DB_DATABASE_NAME_TEST}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('db running'))
.catch(e => console.error('error', e.message));