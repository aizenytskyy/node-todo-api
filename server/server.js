var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

//save new smth
var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({
    text: 'create todo app 3',
    completed: false,
    completedAt: new Date().getTime()
});

newTodo.save().then(
    doc => {
        console.log('Saved todo:', doc);
    },
    err => {
        console.log('Unable to save todo doc');
    }
);
