export interface IUser {
  username: string;
  userStreaming: boolean;
  id: number;
  avatarUrl?: string;
}

export interface IUserBasicData {
  id?: number;
  username: string;
  userStreaming: boolean;
}

export interface ResponseWithToken {
  token: string;
}

export interface IRoom {
  id: string;
  streamOn: boolean;
  name: string;
  description: string;
  activeUsers: IUser[];
}

export interface PaginationValues {
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface RoomsData extends PaginationValues {
  content: IRoom[];
}

export interface MessagesData extends PaginationValues {
  content: IMessage[];
  pageCount: number;
  currentRoomId: string | undefined;
}

export interface IMessage {
  id: number;
  content: string;
  date: string;
  user: IUser;
}

export interface ISendMessageData {
  content: string;
}

export interface AuthData {
  username: string;
  password: string;
}

export interface CreateRoomData {
  name: string;
  description: string;
}
