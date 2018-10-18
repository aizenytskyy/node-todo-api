const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should create a new todo', done => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text })
                    .then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('should NOT create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('schould get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todo/:id', () => {
    it('schould get todo doc by id', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('schould return 404 if todo not found', done => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('schould return 404 for non-object ids', done => {
        request(app)
            .get(`/todos/1234`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todo/:id', () => {
    it('schould remove a todo', done => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId)
                    .then(doc => {
                        expect(doc).toNotExist();
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('schould return 404 if todo not found', done => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('schould return 404 if object id is invalid', done => {
        request(app)
            .delete(`/todos/1234`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todo/:id', () => {
    it('schould update the todo', done => {
        var hexId = todos[0]._id.toHexString();
        var text = 'First text UPDATED';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: true })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId)
                    .then(doc => {
                        expect(doc.text).toBe(text);
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('schould clear completedAt when todo is not completed', done => {
        var hexId = todos[1]._id.toHexString();
        var text = 'Second text UPDATED';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed: false })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId)
                    .then(doc => {
                        expect(doc.text).toBe(text);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', done => {
        var email = 'test@test.com';
        var password = 'testpswd';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then(user => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
    });
    it('should return validation errors if request invalid', done => {
        request(app)
            .post('/users')
            .send({
                email: 'test',
                password: 123
            })
            .expect(400)
            .end(done);
    });
    it('should not create user if email in use', done => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(400)
            .end(done);
    });
});
