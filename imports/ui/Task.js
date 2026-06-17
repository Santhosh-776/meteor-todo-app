import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Task.html';

Template.Task.events({
  async 'change .toggle-checked'(event) {
    await Meteor.callAsync('tasks.toggleChecked', this._id, event.target.checked);
  },
  async 'click .delete-btn'() {
    await Meteor.callAsync('tasks.remove', this._id);
  },
});
