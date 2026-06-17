import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TasksCollection = new Mongo.Collection('tasks');

Meteor.methods({
  async 'tasks.insert'(text, category, position) {
    return await TasksCollection.insertAsync({
      text,
      category,
      position,
      checked: false,
      createdAt: new Date(),
    });
  },
  async 'tasks.toggleChecked'(id, checked) {
    return await TasksCollection.updateAsync(id, {
      $set: { checked },
    });
  },
  async 'tasks.remove'(id) {
    return await TasksCollection.removeAsync(id);
  },
  async 'tasks.updatePositions'(tasksOrder) {
    for (const item of tasksOrder) {
      await TasksCollection.updateAsync(item.id, {
        $set: { position: item.position }
      });
    }
  }
});
