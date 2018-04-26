import { Jobs } from './collections/jobs';
import { Job } from "./models/job";

import { Entities } from './collections/entities';
import { Entity } from "./models/entity";

import { Versions } from './collections/versions';
import { Version } from "./models/version";

import { Clients } from './collections/clients';
import { Client } from "./models/client";

import { Annotation } from "./models/annotation";

import { Users } from './collections/users';

//import { Accounts } from 'meteor/accounts-base';

import { Mongo } from 'meteor/mongo';
import { MeteorObservable } from 'meteor-rxjs';

import { site, jobStructure, shotStructure } from "../settings";

//import { upload } from '../methods';

declare var Fake: any;
declare var Accounts: any;

const users = ['Mike Battcock', 'Mike Skrgatic', 'James Allen', 'Ben Cantor', 'Sam Osbourne'];
const types = ['asset','shot'];
const thumbs = ['audi','audi_breakdown','bmw','dust_01','flip','frames','kittiwakes','liquid','nike','test','vw'];
const images = ['bmw','clothes','interior','wallSmash','warAndPeace','willYoung'];
const videos = ['audi.mov','audi_breakdown.mp4','bmw.mov','dust_01.mov','flip.mov',
                'frames.mov','kittiwakes.mov','liquid.mov','nike.mov','test.mov','vw.mp4'];

const clients = ['BMW','Audi','VW','Finish','Nike'];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function pad(num, size) {
  let s = "000000000" + num;
  return s.substr(s.length-size);
}

export function createSite() {
  clients.forEach(client=>{
    Clients.insert({
      "_id": new Mongo.ObjectID(),
      'name':client})
  })
}

export function createUsers() {
  if (Users.collection.find().count() === 0) {
    console.log('load default users');
    for (var i = 0; i < users.length; i++) {

      Accounts.createUser({
        email: users[i].replace(" ", "_").toLowerCase() + '@time-based-arts.com',
        password: 'password',
        profile: {
          name: users[i],
        }
      });

      console.log('Added ' + users[i] + ' as a User');
    }
  }
}

function createVersion(jobId, jobName, entityId, entityName) {
  var maxNotes = 0;

  var notes = [];
  for (var i=0;i<Math.floor(Math.random() * maxNotes);i++) {
    let note = new Annotation();

    note.author = 'Mike Battcock';
    note.text = Fake.sentence(Math.floor(Math.random() * 8));

    notes.push(note);
  }

  var contentType = 'still';
  var content = '/img/' + images[Math.floor((Math.random() * images.length))] + '.jpg';

  // make half videos
  if (Math.random() > 0.5) {
    contentType = 'video';
    content = videos[Math.floor((Math.random() * videos.length))];
  }

  var taskTypes = ['fx','model','light','comp','texture','track'];
  var taskType = taskTypes[Math.floor((Math.random() * taskTypes.length))];

  var idx = Versions.find( { $and: [{'entity.entityId':entityId}, {'taskType.type':taskType}] } ).cursor.count();

  console.log('found ' + idx + ' versions with type: ' + taskType);

  var versionId = new Mongo.ObjectID();

  console.log('version task: ' + versionId);

  var versionNum = Math.floor((Math.random() * 100) + 1);

  let assetPath = '/Users/michaelbattcock/Documents/dev/apps/pipe9/src/assets/';

  let assetNum = Math.floor(Math.random() * thumbs.length);

  let id = new Mongo.ObjectID();

  var version = {
    '_id': id,
    'job': {
      'jobId': jobId,
      'jobName': jobName
    },
    'entity': {
      'entityId': entityId,
      'entityName': entityName
    },
    'author': 'Mike Battcock',
    'version': versionNum,
    'comments': notes,
    'review': [],
    'contentType': contentType,
    'type': taskType,
    'content': assetPath + 'video/' + videos[assetNum],
    'thumbUrl': assetPath + 'img/' + thumbs[assetNum] + '_sprites.jpg',
    'description': Fake.sentence(7),
    'date': new Date(),
    'public': true
  }

  Versions.insert(version);

  var action = {
    'author':{
      'id':'',
      'name':'Mike Battcock'
    },
    'meta':{
      'name':versionNum.toString(),
      'type':'version',
      'jobId':jobId
    },
    'date': new Date,
    'public': true
  };

  //Activity.insert(action);
}

function createTask(entityId, entityName, taskType, entityPath) {
  console.log('create task'); 
  let taskId = new Mongo.ObjectID();

  var taskUsers = [];
  for (var j=0;j<Math.floor(users.length);j++) {
    if (Math.random() > 0.5) {
      taskUsers.push(users[j]); 
    }
  }

  let todos = [];
  for (var j=0;j<Math.random() * 10;j++) {
    todos.push({
      "author": users[Math.floor((Math.random() * users.length))],
      "text":Fake.sentence(7),
      "done": false
    }); 
  }

  let statusTypes = ['active', 'notStarted', 'pendingFeedback', 'complete'];

  let assetsPath = '/Users/michaelbattcock/Documents/dev/apps/pipe9/src/assets/';
  let thumb = thumbs[Math.floor((Math.random() * thumbs.length))];

  let dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + 2);

  let task = {
    "_id": taskId,
    "entity": {
      "entityId": entityId,
      "entityName": entityName
    },
    "type": taskType,
    "users": taskUsers,
    "todos": todos,
    'thumbUrl': assetsPath + 'img/' + thumb + '_sprites.jpg',
    "startDate": new Date(),
    "dueDate": randomDate(new Date(), dueDate),
    "path": entityPath + taskType + "/",
    'status': statusTypes[Math.floor((Math.random() * statusTypes.length))]
  };

  // create asset on disk
  MeteorObservable.call('createTask', task).subscribe({
    error: (e: Error) => {
      if (e) {
        console.log(e);
      }
    }
  });

  return taskId;
}

function createEntity(job, name, type) {
  var assetsPath = '/Users/michaelbattcock/Documents/dev/apps/pipe9/src/assets/';

  var entityId = new Mongo.ObjectID();

  let thumb = thumbs[Math.floor((Math.random() * thumbs.length))];

  let path = job.path + '3d/';

  path += type == 'asset' ? 'assets/' : 'shots/';
  path += name + '/';

  let taskTypes = ['fx','model','light','comp','texture','track'];
  let taskTypesRand = shuffle(taskTypes);

  let taskIds = [];

  let statusTypes = ['active', 'notStarted', 'pendingFeedback', 'complete'];

  for (var i=0;i<Math.floor(Math.random() * taskTypesRand.length);i++) {
    taskIds.push(createTask(entityId, name, taskTypes[i], path));
  }

  let entity = {
    '_id': entityId,
    'job': {
      'jobId': job._id._str,
      'jobName': job.name
    },
    'name': name,
    'type': type,
    'taskIds': taskIds,
    'status': statusTypes[Math.floor((Math.random() * statusTypes.length))],
    'todos':[],
    'thumbUrl': assetsPath + 'img/' + thumb + '_sprites.jpg',
    //'media': assetsPath + 'video/' + thumb + '.mov',
    'description': Fake.sentence(7),
    'path': path,
    'public': true
  }

  //Entities.insert(entity);

  var action = {
    'author':{
      'id':'',
      'name':'Mike Battcock'
    },
    'meta':{
      'name':name,
      'type':'entity',
      'jobId':job._id._str
    },
    'date': new Date,
    'public': true
  };

  // create asset on disk
  MeteorObservable.call('createEntity', entity).subscribe({
    error: (e: Error) => {
      if (e) {
        console.log(e);
      }
    }
  });

  //Activity.insert(action);

  // random integer between 1 and 10
  var numVersions = Math.floor((Math.random() * 10) + 1);

  // create entities in job
  for (var i = 0; i < numVersions; i++) {
    createVersion(job._id._str, job.name, entityId.valueOf(), entity.name);
  }
} 

export function createJobs() {
  // check if jobs are already in the database
  if (Jobs.find({}).cursor.count() > 0) {
    console.log('found jobs already in database');
    return;
  }

  createSite();

  const jobs: Job[] = [];

  // create fake jobs
  let job = new Job();

  var imgPath = '/Users/michaelbattcock/Documents/dev/apps/pipe9/src/assets/img/';
          //file:///Users/michaelbattcock/Documents/dev/apps/pipe7/src/assets/img/frames_sprites.jpg

  job.name = 'Sneakerboots';
  job.client = 'Nike';
  job.agency = 'More and More';
  job.thumbUrl = imgPath + 'frames_sprites.jpg';
  job.public = true;

  jobs.push(job);

  let job2 = new Job();

  job2.name = 'Service';
  job2.client = 'Audi';
  job2.agency = 'Radical';
  job2.thumbUrl = imgPath + 'audi_sprites.jpg';
  job2.public = true;

  jobs.push(job2);

  let jobId = '';

  let numShots = 10;
  let numAssets = 5;

  // iterate over jobs array and insert the jobs
  for (var i = 0; i < jobs.length; i++) {
    let objectId = new Mongo.ObjectID();

    jobs[i]._id = objectId; // remove valueOf() for mongo style id generation

    // create path on disk
    jobs[i].path = site.root +
                   site.projects + 
                   jobs[i].client + '/' +
                   jobs[i].name + '/';

    /////// CREATE JOB IN DATABASE ///////
    this.jobId = Jobs.insert(jobs[i]);

    /////// CREATE THUMBNAIL IN DATABASE //////
    // upload(file)
    //   .then(() => {
    //     this.uploading = false;
    //   })
    //   .catch((error) => {
    //     this.uploading = false;
    //     console.log(`Something went wrong!`, error);
    //   });

    ///////// CREATE JOB ON DISK /////////
    Meteor.call('createJob', jobs[i], 0, function(error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log('RETURNED A JOB RESULT!' + result);
      }
    });

    // MeteorObservable.call('createJob', jobs[i], 0).subscribe({
    //   error: (e: Error) => {
    //     if (e) {
    //       console.log(e);
    //     }
    //     else {
    //       console.log('RETURNED A JOB RESULT!' + e);
    //     }
    //   }
    // });

    // create assets in job
    for (var j = 0; j < numAssets; j++) {
      let name = Fake.word();
      createEntity(jobs[i], name, 'asset');
    }
    for (var j = 0; j < numShots; j++) {
      //let name = 'sh' + pad(j+1,3) + '0';
      createEntity(jobs[i], j+10, 'shot');
    }
  }
}
