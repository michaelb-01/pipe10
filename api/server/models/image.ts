export interface Image {
  _id?: string;
  complete: boolean;
  extension: string;
  name: string;
  progress: number;
  size: number;
  store: string;
  token: string;
  type: string;
  uploadedAt: Date;
  uploading: boolean;
  url: string;
  width: number;
  height: number;
  userId?: string;
}

export interface Thumb extends Image  {
  originalStore?: string;
  originalId?: string;
}
