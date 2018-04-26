import { MongoObservable } from 'meteor-rxjs';
import { Version } from '../models/version';
 
export const Versions = new MongoObservable.Collection<Version>('versions');