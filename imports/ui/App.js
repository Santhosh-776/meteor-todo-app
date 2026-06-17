import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TasksCollection } from '../api/tasksCollection';
import './App.html';
import './Task.js';

Template.app.onCreated(function () {
  this.categoryFilter = new ReactiveVar('');
});

Template.app.helpers({
  tasks() {
    const instance = Template.instance();
    const filter = instance.categoryFilter.get();
    const query = filter ? { category: filter } : {};
    return TasksCollection.find(query, { sort: { position: 1 } });
  },
});

Template.app.events({
  'change .category-filter'(event, templateInstance) {
    templateInstance.categoryFilter.set(event.target.value);
  },
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
