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
  },
  async 'tasks.moveTask'(id, targetCategory, sourceCategory, newIndex) {
    // 1. If moving between categories:
    if (targetCategory !== sourceCategory) {
      await TasksCollection.updateAsync(id, {
        $set: { category: targetCategory }
      });
    }
    
    // 2. Fetch and reorder target category tasks
    const targetTasks = await TasksCollection.find({ category: targetCategory }, { sort: { position: 1 } }).fetchAsync();
    const movedTaskIndex = targetTasks.findIndex(t => t._id === id);
    
    let movedTask;
    if (movedTaskIndex !== -1) {
      [movedTask] = targetTasks.splice(movedTaskIndex, 1);
    } else {
      movedTask = await TasksCollection.findOneAsync(id);
    }
    
    if (movedTask) {
      targetTasks.splice(newIndex, 0, movedTask);
    }
    
    // Save target positions
    for (let i = 0; i < targetTasks.length; i++) {
      await TasksCollection.updateAsync(targetTasks[i]._id, {
        $set: { position: i }
      });
    }
    
    // 3. If source was different, also reorder source tasks to close the gap
    if (targetCategory !== sourceCategory) {
      const sourceTasks = await TasksCollection.find({ category: sourceCategory }, { sort: { position: 1 } }).fetchAsync();
      for (let i = 0; i < sourceTasks.length; i++) {
        await TasksCollection.updateAsync(sourceTasks[i]._id, {
          $set: { position: i }
        });
      }
    }
  }
});
