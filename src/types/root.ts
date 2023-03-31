// User fields
export interface IUser {
  id: number;
  username: string;
  userStreaming: boolean;
  avatarUrl?: string;
}

export interface IUserBasicData extends IUser {
  username: string;
  userStreaming: boolean;
}

// Room fields
export interface IUserRoom {
  username: string;
  userStreaming: boolean;
}

export interface IRoom {
  id: string;
  streamOn: boolean;
  name: string;
  description: string;
  users: IUserRoom[];
}

export interface PaginationValues {
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface RoomsData extends PaginationValues {
  content: IRoom[];
}

// Message fields
export interface IMessage {
  id: number;
  content: string;
  date: string;
  user: IUser;
}

export interface MessagesData extends PaginationValues {
  content: IMessage[];
}

// Data for sending a message
export interface ISendMessageData {
  content: string;
  totalElements: number;
  totalPages: number;
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
