// User fields
export interface IUser {
  id: number;
  username: string;
  avatarUrl: string;
}

// Room fields
export interface IRoom {
  id: number;
  name: string;
  description?: string;
  streamOn: boolean;
  users: string[];
}

// Message fields
export interface IMessage {
  id: number;
  content: string;
  date: string;
  user: IUser;
}

// Data for sending a message
export interface ISendMessageData {
  content: string;
}

// Data for login/register
export interface AuthData {
  username: string;
  password: string;
}

// Data to create a room
export interface CreateRoomData {
  name: string;
  description: string;
}
