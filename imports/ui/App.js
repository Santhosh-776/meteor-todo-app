import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Sortable from 'sortablejs';
import { TasksCollection } from '../api/tasksCollection';
import './App.html';
import './Task.js';

Template.app.onCreated(function () {
  this.subscribe('tasks');
});

Template.app.onRendered(function () {
  // Query all column lists and initialize Sortable on each of them
  const lists = this.findAll('.tasks-list');
  lists.forEach(list => {
    Sortable.create(list, {
      group: 'kanban-tasks', // Same group allows dragging between columns
      animation: 150,
      handle: '.task-content',
      async onEnd(evt) {
        const movedId = evt.item.dataset.id;
        const targetCategory = evt.to.dataset.category;
        const sourceCategory = evt.from.dataset.category;
        const newIndex = evt.newIndex;

        // Perform category and position updates on the server
        await Meteor.callAsync('tasks.moveTask', movedId, targetCategory, sourceCategory, newIndex);
      }
    });
  });
});

Template.app.helpers({
  tasksByCategory(category) {
    return TasksCollection.find({ category }, { sort: { position: 1 } });
  },
});

Template.app.events({
  async 'submit .task-form'(event) {
    event.preventDefault();

    const text = event.target.text.value.trim();
    const category = event.target.category.value;

    if (!text) return;

    // Get task count in the target category for positioning
    const totalCount = await TasksCollection.find({ category }).countAsync();

    await Meteor.callAsync('tasks.insert', text, category, totalCount);

    event.target.reset();
  },
});
