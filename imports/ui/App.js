import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Sortable from 'sortablejs';
import { TasksCollection } from '../api/tasksCollection';
import './App.html';
import './Task.js';

Template.app.onCreated(function () {
  this.categoryFilter = new ReactiveVar('');
});

Template.app.onRendered(function () {
  const list = this.find('#tasks-list');
  Sortable.create(list, {
    animation: 150,
    handle: '.task-content',
    async onEnd(evt) {
      const movedId = evt.item.dataset.id;
      const nextSibling = evt.item.nextElementSibling;
      const nextId = nextSibling ? nextSibling.dataset.id : null;

      const allTasks = await TasksCollection.find({}, { sort: { position: 1 } }).fetchAsync();
      const movedTaskIndex = allTasks.findIndex(t => t._id === movedId);
      if (movedTaskIndex === -1) return;

      const [movedTask] = allTasks.splice(movedTaskIndex, 1);

      if (nextId) {
        const nextIndex = allTasks.findIndex(t => t._id === nextId);
        allTasks.splice(nextIndex, 0, movedTask);
      } else {
        const prevSibling = evt.item.previousElementSibling;
        const prevId = prevSibling ? prevSibling.dataset.id : null;
        if (prevId) {
          const prevIndex = allTasks.findIndex(t => t._id === prevId);
          allTasks.splice(prevIndex + 1, 0, movedTask);
        } else {
          allTasks.push(movedTask);
        }
      }

      // Update positions in the database
      allTasks.forEach(async (task, index) => {
        await TasksCollection.updateAsync(task._id, {
          $set: { position: index }
        });
      });
    }
  });
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
