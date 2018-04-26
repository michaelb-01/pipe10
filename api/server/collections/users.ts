import { MongoObservable } from 'meteor-rxjs';
//import { Meteor } from 'meteor/meteor';
import { User } from '../models/user';

export const Users = MongoObservable.fromExisting(Meteor.users);
