interface ICreate {
  name: string;
  email: string;
  password: string;
}

interface IUpdate {
  user_id: string;
  name: string;
  oldPassword: string;
  newPassword: string;
  avatar_url?: IFileUpload;
}
interface IFileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export { ICreate, IUpdate };
