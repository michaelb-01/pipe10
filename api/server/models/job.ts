export interface IJob {
  name?: string;
  client?: string;
  agency?: string;
  thumbUrl?: string;
  camera? : {
    brand?: string;
    type?: string;
    sensor?: {
      width?: number;
      height?: number;
    }
    res?: {
      width?: number;
      height?: number;
    }
  };
  output?: {
    fps?: number;
    width?: number;
    height?: number;
    lengths?: string[];
  };
  dueDate: Date;
  path?: string;
  public?: boolean;
}

export class Job implements IJob {
  _id?: Mongo.ObjectID;
  name:string = '';
  client:string = '';
  agency:string = '';
  thumbUrl:string = '';
  camera:any = {
    brand: '',
    type: '',
    sensor: {
      width: 0,
      height: 0,
    },
    res: {
      width: 0,
      height: 0,
    }
  };
  dueDate:Date = new Date();
  output:any = {
    fps: 25,
    width: 1920,
    height: 1080,
    lengths: [],
  };
  path:string =  '';
  public:boolean = true;
}