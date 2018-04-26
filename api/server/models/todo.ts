export interface ITodo {
  _id?: Mongo.ObjectID;
  user: {
    id: string,
    name: string
  };
  text: string;
  done: boolean;
  editing?: boolean;
}

class user {
  id: string = '';
  name: string = '';
}

export class Todo implements ITodo {
  _id?: Mongo.ObjectID = new Mongo.ObjectID();
  user: user = new user();
  text: string = '';
  done: boolean = false;
  editing?: boolean;
}