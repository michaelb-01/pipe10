import { Job } from './models/job';
import { Jobs } from './collections/jobs';

import { Entity } from './models/entity';
import { Entities } from './collections/entities';

import { Task } from './models/task';
import { Tasks } from './collections/tasks';

import { Version } from './models/version';
import { Versions } from './collections/versions';

import { User } from './models/user';
import { Users } from './collections/users';

import { Image } from './models/image';
import { Images } from './collections/images';

import { Client } from './models/client';
import { Clients } from './collections/clients';

import { publishComposite } from 'meteor/reywood:publish-composite';
 
Meteor.publish('jobs', function(): Mongo.Cursor<Job> { 
  return Jobs.collection.find({}, {

  });
});

// Meteor.publish('entities', function(): Mongo.Cursor<Entity> { 
//   return Entities.collection.find({}, {

//   });
// });

publishComposite('jobEntities', function(jobId) {
  return {
    find: () => {
      return Entities.collection.find({ "job.jobId" : jobId });
    },
 
    children: [
      {
        find: (entity) => {
          return Tasks.collection.find({ "_id": { "$in": entity.taskIds } });
        }
      }
    ]
  };
});

Meteor.publish('entity', function(entityId): Mongo.Cursor<Entity> { 
  console.log('get id with: ' + entityId);
  return Entities.collection.find({ "_id": new Mongo.ObjectID(entityId) }, {

  });
});

Meteor.publish('entities', function(): Mongo.Cursor<Entity> { 
  return Entities.collection.find({}, {

  });
});

Meteor.publish('myTasks', function(username): Mongo.Cursor<Task> { 
  console.log('find tasks with: ' + username);
  return Tasks.collection.find({ "users": username }, {

  });
});

Meteor.publish('tasks', function(): Mongo.Cursor<Task> { 
  return Tasks.collection.find({}, {

  });
});

Meteor.publish('versions', function(): Mongo.Cursor<Version> { 
  return Versions.collection.find({}, {

  });
});

Meteor.publish('users', function(): Mongo.Cursor<User> { 
  return Users.collection.find({}, {

  });
});

Meteor.publish('images', function(): Mongo.Cursor<Image> { 
  return Images.collection.find({}, {

  });
});

Meteor.publish('clients', function(): Mongo.Cursor<Client> { 
  return Clients.collection.find({}, {

  });
});
