const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Users')
      .findOneAndUpdate(
        {
          _id: new ObjectID('5bb2472c3c7c64a660e1b5bb'),
        },
        {
          $set: {
            name: 'Andriy',
          },
          $inc: {
            age: 1,
          },
        },
        {
          returnOriginal: false,
        },
      )
      .then(res => {
        console.log(res);
      });
    // db.close();
  },
);
