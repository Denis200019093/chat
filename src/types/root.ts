export interface StreamerData {
  id: number;
  streamer: string;
  viewers: string[];
}

export interface IUser {
  username: string;
  stream: StreamerData | null;
  id: number;
  avatarUrl?: string;
}

export interface IUserBasicData {
  id?: number;
  username: string;
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

export interface SnackbarParams {
  text: string;
  severity?: "error" | "warning" | "info" | "success";
  open?: boolean;
}

export interface StreamerViewerUsernames {
  viewerUsername: string;
  streamerUsername: string;
}
