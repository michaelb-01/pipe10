export interface IVersion {
  job: {
    jobId: string,
    jobName: string
  };
  entity: {
    entityId: string,
    entityName: string
  };
  author: string;
  version: number;
  comments?: any[];
  review: any[];
  contentType: string;
  type: string,
  content?: string;
  thumbUrl?: string;
  description?: string;
  date?: Date;
  public: boolean;
}

class job {
  jobId: string = '';
  jobName: string = '';
}

class entity {
  entityId: string = '';
  entityName: string = '';
}

export class Version {
  job: job = new job();
  entity: entity = new entity();
  author: string = '';
  version: number = -1;
  comments?: any[] = [];
  review: any[] = [];
  contentType: string = '';
  type: string = '';
  content?: string = '';
  thumbUrl?: string = '';
  description?: string = '';
  date?: Date = new Date();
  public: boolean = true;
}
