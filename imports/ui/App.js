import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/tasksCollection';
import './App.html';
import './Task.js';

Template.app.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { position: 1 } });
  },
});

Template.app.events({
  async 'submit .task-form'(event) {
    event.preventDefault();

    const text = event.target.text.value.trim();
    const category = event.target.category.value;

    if (!text) return;

    // Get total task count for positioning the new task at the end
    const totalCount = await TasksCollection.find().countAsync();

    await TasksCollection.insertAsync({
      text,
      category,
      position: totalCount,
      checked: false,
      createdAt: new Date(),
    });

    event.target.reset();
  },
});
