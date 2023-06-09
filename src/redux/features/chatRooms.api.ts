import { IRoom, RoomsData } from "../../types/root";
import { api } from "./api";

export const chatRoomsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRooms: build.query<
      RoomsData,
      { pageCount: number; searchValue: string }
    >({
      query: ({ pageCount, searchValue }) => ({
        url: `/chatrooms?page=${pageCount}&name=${searchValue}`,
      }),
      providesTags: [{ type: "Room", id: "Check" }],
    }),
    getRoomInfo: build.query<IRoom, string | undefined>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}`,
      }),
    }),
    createRoom: build.mutation<
      IRoom,
      {
        name: string;
        description: string;
      }
    >({
      query: (dataRoom) => ({
        url: `/chatrooms`,
        method: "POST",
        body: dataRoom,
      }),
      invalidatesTags: () => [{ type: "Room", id: "Check" }],
    }),
  }),
});

export const { useGetRoomsQuery, useGetRoomInfoQuery, useCreateRoomMutation } =
  chatRoomsApi;
