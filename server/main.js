import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/tasksCollection';

Meteor.startup(async () => {
  if (await TasksCollection.find().countAsync() === 0) {
    await TasksCollection.insertAsync({
      text: 'Finish assignment',
      category: 'Work',
      position: 0,
      createdAt: new Date(),
    });

    await TasksCollection.insertAsync({
      text: 'Buy groceries',
      category: 'Personal',
      position: 1,
      createdAt: new Date(),
    });

    await TasksCollection.insertAsync({
      text: 'Fix production bug',
      category: 'Urgent',
      position: 2,
      createdAt: new Date(),
    });
  }

  Meteor.publish('tasks', function () {
    return TasksCollection.find();
  });
});
