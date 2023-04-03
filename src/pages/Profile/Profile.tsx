import React from "react";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useUploadAvatarMutation } from "src/redux/features/api";

interface FormData {
  file: File[];
}

const Profile: React.FC = () => {
  const [uploadAvatar] = useUploadAvatarMutation();

  const { register, handleSubmit } = useForm<FormData>();

  const [error, setError] = React.useState<string>("");

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("image", data.file[0]);

      // console.log(formData);
      const url = await uploadAvatar(formData);
      // console.log(url);
    } catch (err) {
      setError("Error uploading avatar");
    }
  };

  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" {...register("file")} />

        <input type="submit" />
      </form>
      {/* <img alt="alt" src="https://nukem-chatroom.s3.eu-central-1.amazonaws.com/admin_AVATAR"/> */}
    </Grid>
  );
};
export default Profile;
