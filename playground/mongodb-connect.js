const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos')
      .find()
      .count()
      .then(
        count => {
          console.log(`Count: ${count}`);
        },
        err => {
          console.log('Error fetch todos count', err);
        },
      );

    db.collection('Users')
      .find({ name: 'Andrew' })
      .toArray()
      .then(
        users => {
          console.log(JSON.stringify(users, undefined, 2));
        },
        err => {
          console.log('Error fetch users count', err);
        },
      );
    // db.collection('Todos').insertOne(
    //     {
    //         text: 'Something to do',
    //         completed: false
    //     },
    //     (err, result) => {
    //         if (err) {
    //             return console.log('Unable to insert todo', err);
    //         }
    //
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     }
    // );

    // Insert new doc into Users (name, age, location)
    // db.collection('Users').insertOne(
    //     {
    //         name: 'Andrew',
    //         age: 25,
    //         location: 'Philadelphia'
    //     },
    //     (err, result) => {
    //         if (err) {
    //             return console.log('Unable to insert user', err);
    //         }
    //
    //         console.log(result.ops);
    //     }
    // );

    db.close();
  },
);
