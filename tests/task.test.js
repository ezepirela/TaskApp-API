const  {setUpDatabase, newUser} =   require('./fixtures/db'),
        request                 =   require('supertest'),
        tasksModel              =   require('../Models/tasks'),
        app                     =   require('../app'); 
beforeEach(setUpDatabase)
test('should create a new task', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
    .send({
        description: 'maria no es mi amiga'
    })
    .expect(201)
    const taskCreated = await tasksModel.findById(response.body.task._id);
    expect(taskCreated).not.toBeNull()
    expect(taskCreated.completed).toEqual(false);
})