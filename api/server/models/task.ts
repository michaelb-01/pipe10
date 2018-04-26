export interface ITask {
  _id?: Mongo.ObjectID;
  entity: {
    entityId: string,
    entityName: string
  };
  type: string;        // model, fx etc.
  slug: string;        // makes task unique when there are multiple tasks of the same type
  todos: string[];
  users: string[];
  status: string;
  startDate: Date;
  dueDate: Date;
  thumbUrl?: string;
  path?: string;
  public?: boolean;
}

class entity {
  entityId: string = '';
  entityName: string = '';
}

export class Task implements ITask {
  _id?: Mongo.ObjectID;
  entity: entity = new entity();
  type: string = '';
  slug: string = '';
  todos: string[] = [];
  users: string[] = [];
  status: string = 'notStarted';
  startDate: Date = new Date();
  dueDate: Date = new Date();
  thumbUrl?: string = '';
  path?: string = '';
  public: boolean = true;
}