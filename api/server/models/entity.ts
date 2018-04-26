export interface IEntity {
  _id?: Mongo.ObjectID;
  job: {
    jobId: string,
    jobName: string
  };
  name: string;
  type: string;
  taskIds?: any[];
  status: string;
  thumbUrl?: string;
  description?: string;
  todos?: any[];  
  path?: string;
  public: boolean;
}

class job {
  jobId: string = '';
  jobName: string = '';
}

export class Entity implements IEntity {
  _id?: Mongo.ObjectID;
  job: job = new job();
  name: string = '';
  type: string = 'shot';
  taskIds?: any[] = [];
  status: string = 'notStarted';
  thumbUrl?: string = '';
  description?: string = '';
  todos?: any[] = [];  
  path?: string = '';
  public: boolean = true;
}