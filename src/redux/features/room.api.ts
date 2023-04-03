import { CreateRoomData, IRoom, RoomsData } from "../../types/root";
import { api } from "./api";

export const roomsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRooms: build.query<
      RoomsData,
      { pageCount: number; searchValue: string }
    >({
      query: ({ pageCount, searchValue }) => ({
        url: `/chatrooms?page=${pageCount}&name=${searchValue}`,
      }),
      providesTags: [{ type: "Room", id: "Room" }],
    }),
    getRoomInfo: build.query<IRoom, string | undefined>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}`,
      }),
    }),
    createRoom: build.mutation<IRoom, CreateRoomData>({
      query: (dataRoom) => ({
        url: `/chatrooms`,
        method: "POST",
        body: dataRoom,
      }),
      invalidatesTags: () => [{ type: "Room", id: "Room" }],
    }),
  }),
});

export const { useGetRoomsQuery, useGetRoomInfoQuery, useCreateRoomMutation } =
  roomsApi;
