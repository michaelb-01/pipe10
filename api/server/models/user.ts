interface Profile {
  name?: string;
  picture?: string;
  pictureId?: string;
}

export interface User extends Meteor.User {
  profile?: Profile;
}