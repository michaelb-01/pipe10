import { MongoObservable } from 'meteor-rxjs';
import { Job } from '../models/job';
 
export const Jobs = new MongoObservable.Collection<Job>('jobs');