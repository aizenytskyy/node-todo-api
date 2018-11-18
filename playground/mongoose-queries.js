const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '5bbb1736f4be4f30f5e9d65a';
var userId = '5bb48f58f37da6fcc71ba446';

if (!ObjectID.isValid(id)) {
  console.log('Id is not valid');
}

Todo.find({
  _id: id,
}).then(todos => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id,
}).then(todo => {
  console.log('Todo', todo);
});

Todo.findById(id)
  .then(todo => {
    console.log('Todo', todo);
  })
  .catch(e => {
    console.log(e);
  });

User.findById(userId)
  .then(user => {
    if (!user) {
      return console.log('Unable to find User');
    }
    console.log('User', user);
  })
  .catch(e => {
    console.log(e);
  });
