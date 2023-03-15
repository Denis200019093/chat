import { chatRoomsApi } from "./chatRooms.api";

export const fileUploadApi = chatRoomsApi.injectEndpoints({
  endpoints: (build) => ({
    uploadAvatar: build.mutation<string, FormData>({
      query: (file) => ({
        url: "/user/avatar",
        method: "POST",
        body: file,
      }),
    }),
  }),
});

export const { useUploadAvatarMutation } = fileUploadApi;
