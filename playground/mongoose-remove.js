const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// remove all todos from table
// Todo.remove({}).then(res => {
//     console.log(res);
// })

Todo.findByIdAndRemove('5bbcda80b3130555707bfe32').then(todo => {
  console.log(todo);
});
