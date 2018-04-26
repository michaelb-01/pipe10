import { MongoObservable } from 'meteor-rxjs';
import { Entity } from '../models/entity';
 
export const Entities = new MongoObservable.Collection<Entity>('entities');