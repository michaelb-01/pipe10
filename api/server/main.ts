
import { Meteor } from 'meteor/meteor';

import { createJobs } from './initialise_db';
import { createUsers } from './initialise_db';

Meteor.startup(() => {

  console.log('running Meteor.startup');
  // initialise database
  createJobs();
  createUsers();
});

