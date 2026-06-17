import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/tasksCollection';
import './App.html';
import './Task.js';

Template.app.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { position: 1 } });
  },
});
