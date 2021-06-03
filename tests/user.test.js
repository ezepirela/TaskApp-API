const   app         =   require('../app'),
        request     =   require('supertest')
        userModel   =   require('../Models/user'),
        {setUpDatabase, newUser} = require('./fixtures/db');

beforeEach(setUpDatabase)
// test('should sign up a new user', async () =>{
//     const response = await request(app).post('/user').send({
//         name: 'ezequiel',
//         email: 'ezepirela@gmail.com',
//         password: 12345678,
//         age: 23
//     }).expect(201)
//     // assert that the database was changed correctly
//     const user = await userModel.findById(response.body.newUser._id);
//     expect(user).not.toBeNull()
//     // assertions about the response 
//     expect(response.body).toMatchObject({
//         newUser: {
//             name: "ezequiel",
//             email: 'ezepirela@gmail.com'
//         },
//         token: user.tokens[0].token
//     })
//     // expect the user password in the database should be hashed
//     expect(user.password).not.toBe('12345678')
// })

// test('should login a user', async () =>{
//     const response = await request(app).post('/user/login').send({
//         email: newUser.email,
//         password: newUser.password,
//     }).expect(200)
//     const user = await userModel.findById({_id: newUser._id})
//     expect(response.body.token).toBe(user.tokens[1].token);
// })

// test("should'nt login a user", async () =>{
//     await request(app).post('/user/login').send({
//         email: newUser.email,
//         password: "123123123123",
//     }).expect(404)
// })

// test("should get user profile", async () =>{
//     await request(app)
//     .get('/user/myProfile')
//     .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
//     .send()
//     .expect(200)
// })

// test("should'nt get a user", async () =>{
//     await request(app)
//     .get('/user/myProfile')
//     .send()
//     .expect(404)
// })

// test("should delete a user", async () =>{
//     await request(app)
//     .delete('/user/myProfile')
//     .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
//     .send()
//     .expect(200)
//     const user = await userModel.findById(newUser._id);
//     expect(user).toBeNull();
// })

// test("should not delete a user", async () =>{
//     await request(app)
//     .delete('/user/myProfile')
//     .send()
//     .expect(404)
// })

test('should upload avatar image', async () => {
    await request(app)
    .post('/user/uploadImage')
    .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
    .attach('upload', 'tests/fixtures/profile-pic.jpg')
    expect(200)
    const user = await userModel.findById(newUser._id);
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test('should update user', async () => {
    const response = await request(app)
    .patch('/user/myProfile')
    .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
    .send({
        name: 'ezequiel 19'
    })
    .expect(200)
    expect(response.body.user.name).toEqual('ezequiel 19')
})

test("should'nt update user", async () => {
    await request(app)
    .patch('/user/myProfile')
    .set('Authorization', `Bearer ${newUser.tokens[0].token}`)
    .send({
        location: 'ezequiel 19'
    })
    .expect(404)
    
})

