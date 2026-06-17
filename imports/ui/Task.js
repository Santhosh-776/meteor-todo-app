import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/tasksCollection';
import './Task.html';

Template.Task.events({
  async 'change .toggle-checked'(event) {
    await TasksCollection.updateAsync(this._id, {
      $set: { checked: event.target.checked },
    });
  },
  async 'click .delete-btn'() {
    await TasksCollection.removeAsync(this._id);
  },
});
