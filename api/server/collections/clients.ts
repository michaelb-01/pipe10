import { MongoObservable } from 'meteor-rxjs';
import { Client } from '../models/client';
 
export const Clients = new MongoObservable.Collection<Client>('clients');