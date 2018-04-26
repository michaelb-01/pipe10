import { site, jobStructure, shotStructure } from "./settings";
//import mkdirp = require('mkdirp');
import * as mkdirp from 'mkdirp';
//import fs = require('fs');
import * as fs from 'fs'
import { Future } from 'fibers/future';
//import * as path from 'path';
const path = require('path');
//const cp = require("child_process");

import { Jobs } from "./server/collections/jobs";
import { Entities } from './server/collections/entities';
import { Tasks } from './server/collections/tasks';
import { Versions } from './server/collections/versions';

declare var Npm;

import * as drivelist from "drivelist";

// import { UploadFS } from 'meteor/jalik:ufs';
// import { ImagesStore } from './server/collections/images';

// export function upload(data: File, imgWidth: number, imgHeight: number): Promise<any> {
//   return new Promise((resolve, reject) => {
//     console.log('upload image');
//     // pick from an object only: name, type and size
//     const file = {
//       name: data.name,
//       type: data.type,
//       size: data.size,
//       width: imgWidth,
//       height: imgHeight
//     };
 
//     const upload = new UploadFS.Uploader({
//       data,
//       file,
//       store: ImagesStore,
//       onError: reject,
//       onComplete: resolve
//     });
 
//     upload.start();
//   });
// }

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function createFolder(path) {
  mkdirp(path, function (err) {
      if (err) {
        console.error(err)
      }
      //else { console.log('success'); }
  });
}

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function buildDir(folder,parentFolder) {
  for (var key in folder) {
    //console.log('created directory: ' + parentFolder + key);
    mkdirp(parentFolder + key, function (err) {
        if (err) {
          console.error(err)
        }
        //else { console.log('success'); }
    });
  
    if (typeof folder[key] == "object") {
      buildDir(folder[key],parentFolder+key+'/');
    }
  }
}

// function createShots(job,numShots) {
//   let shotPath = job.path + '3d/shots/';

//   for (var i = 1; i <= numShots; i++) {
//     let name = 'sh' + pad(i,3) + '0';
//     let path = shotPath + name;

//     let entity = {
//       '_id': new Mongo.ObjectID(),
//       'job': {
//         'jobId': job._id._str,
//         'jobName': job.name
//       },
//       'name': name,
//       'type': 'shot',
//       'status': 'Not Started',
//       'todos':[],
//       //'thumbUrl': '../assets/img/' + thumb + '_sprites.jpg',
//       //'media': '../assets/video/' + thumb + '.mov',
//       'path': path,
//       'public': true
//     }

//     // insert in database
//     createEntity(entity);

//     // make shot directory
//     mkdirp(shotPath + name);

//     // build shot structure 
//     buildDir(shotStructure,path+'/');
//   }
// }


Meteor.methods({
  // createJob(job,numShots,db) {
  //   let name = job.client + '_' + job.name;
  //   let root = path.join(site.root, site.projects, job.client, name) + '/';

  //   if (db) {
  //     job._id = new Mongo.ObjectID();
  //     Jobs.insert(job);
  //   }

  //   buildDir(jobStructure, root);
  //   buildShots(root,numShots);
  // },

  createJob(job,numShots) {
    if (!('_id' in job)) {
      job._id = new Mongo.ObjectID();
    }

    Jobs.insert(job);

    buildDir(jobStructure, job.path);
    //createShots(job.path,numShots);

    let shotPath = job.path + '3d/shots/';

    for (var i = 1; i <= numShots; i++) {
      let name = (i+10).toString();
      //let name = 'sh' + pad(j+1,3) + '0';
      
      let path = shotPath + name;

      let entity = {
        '_id': new Mongo.ObjectID(),
        'job': {
          'jobId': job._id._str,
          'jobName': job.name
        },
        'name': name,
        'type': 'shot',
        'status': 'Not Started',
        'todos':[],
        //'thumbUrl': '../assets/img/' + thumb + '_sprites.jpg',
        //'media': '../assets/video/' + thumb + '.mov',
        'path': path,
        'public': true
      }

      Entities.insert(entity);

      //createFolder(entity.path);
      buildDir(shotStructure, entity.path + '/');
    }

    return 'hello';
  },

  updateEntity(entity) {
    if (!('_id' in entity)) {
      entity._id = new Mongo.ObjectID();
    }

    // using update/upsert so documents with the same name cannot be create
    console.log('update entity: ');
    console.log(entity);
    console.log(entity.job);

    Entities.update(
       { "_id":entity._id },
       entity,
       { upsert: true }
    )

    //Entities.insert(entity);
    //createFolder(entity.path);
    buildDir(shotStructure, entity.path);
  },

  deleteEntity(entity) {
    Entities.remove( {"_id": entity._id});

    deleteFolderRecursive(entity.path);
  },

  createAsset(jobName, jobClient, assetName) {
    let jobFolder = jobClient + '_' + jobName;
    let path = site.root + '/' + site.projects + '/' + jobClient + '/' + jobFolder + '/3d/assets/' + assetName;
    //let path = path.join(site.root, site.projects, jobClient, jobFolder) + '/3d/assets/' + assetName;

    createFolder(path);
    buildDir(shotStructure, path+'/');
  },

  createTask(task) {
    if (!('_id' in task)) {
      task._id = new Mongo.ObjectID();
    }

    // using update/upsert so documents with the same name cannot be create

    Tasks.update(
       { '$and': [ { "entity.entityId":task.entity.entityId }, { name: task.type }]},
       task,
       { upsert: true }
    )

    //Entities.insert(entity);
    //createFolder(entity.path);
    //buildDir(shotStructure, task.path);
  },

  updateTaskTodo(task,todo,matchText) {
    delete todo.editing;

    Tasks.update(
       { "$and": [ { "_id": task._id }, { "todos.text": matchText }]},
       { "$set" : {"todos.$" : todo}}
    )

    // remove any empty todos
    Tasks.update(
       { "_id": task._id },
       { "$pull" : {"todos" : {'text':''}}}
    )
  },

  updateAnnotation(annotation, version) {
    Versions.update(
      { "$and": [ { "_id": version._id }, { "comments.date": annotation.date }]},
      { "$set" : {"comments.$" : annotation}});
  },

  deleteAnnotation(annotation, version) {
    Versions.update(
      { "_id": version._id },
      { "$pull" : {"comments.date" : annotation.date.toISOString()}});
  },

  // readImage: function(url) {
  //   console.log('read file from: ' + url);

  //   //var Future = Npm.require('fibers/future');
  //   // var myFuture = new Future();

  //   fs.readFile(String(url), function read(error, result) {
  //     if(error){
  //       myFuture.throw(error);
  //     }else{
  //       myFuture.return(new Buffer(result).toString('base64'));
  //     }
  //   });

  //   // return myFuture.wait();
  // }

  readImageWrapped() {

  },

  readImage2(url) {
    var Future = Npm.require('fibers/future');
    var myFuture = new Future();

    fs.readFile(String(url), function read(error, result) {
      if(error){
        myFuture.throw(error);
      }else{
        myFuture.return(new Buffer(result).toString('base64'));
      }
    });

    return myFuture.wait();
  },

  updateTodo(entityId,todo) {
    Entities.update({"_id":entityId,
               "todos._id":todo._id},
               {$set:{"todos.$.text":todo.text,
                      "todos.$.done":todo.done}});
  },


  // openMaya() {
  //   console.log('open maya');
  //   //cp.exec("open -a /Applications/Autodesk/maya2017/Maya.app"); // notice this without a callback..
  //   cp.exec('open -n "/Applications/Houdini/Houdini16.5.268/Houdini FX 16.5.268.app"');
  // }

});

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}