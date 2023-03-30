import React, { useMemo, useEffect } from "react";
import {
  Grid,
  Tooltip,
  Typography,
  styled,
  Menu,
  IconButton,
  MenuItem,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import useHover from "src/hooks/useHover";
import { useDeleteMessageMutation } from "src/redux/features/messages.api";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { startEdit } from "src/redux/slices/messagesSlice";
import { IMessage } from "src/types/root";

const ITEM_HEIGHT = 48;

interface IProps {
  message: IMessage;
}

const Message: React.FC<IProps> = ({ message }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { me } = useAppSelector((state) => state.users);
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();
  const [deleteMessage] = useDeleteMessageMutation();
  const dispatch = useAppDispatch();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = useMemo(() => {
    return [
      {
        label: "Delete",
        onClick: () => deleteMessage(message.id),
      },
      {
        label: "Edit",
        onClick: () =>
          dispatch(
            startEdit({
              messageId: message.id,
              messageContent: message.content,
            })
          ),
      },
    ];
  }, [deleteMessage, dispatch, message.content, message.id]);

  return (
    <MessageContainer
      container
      ref={hoverRef}
      sx={{ bgcolor: isHovered ? "rgba(255,255,255,0.15)" : "" }}
      alignItems="flex-start"
      flexWrap="nowrap"
    >
      <Grid item sx={{ mr: 1.3 }}>
        {/* <Avatar src={message.user.avatarUrl || ""} /> */}
      </Grid>
      <Grid container item>
        <Grid container item sx={{ mb: 1 }} spacing={1}>
          <Grid item>
            <Typography variant="h6">{message.user.username}</Typography>
          </Grid>
          <Grid item>
            <Tooltip
              arrow
              title={message.date.slice(11, 16)}
              placement="right-start"
            >
              <Typography variant="h6">{message.date.slice(0, 10)}</Typography>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid>
          <Typography variant="h6">{message.content}</Typography>
        </Grid>
      </Grid>
      <Grid>
        {isHovered && message.user.id === me?.id ? (
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            sx={{
              color: "#fff",
              position: "absolute",
              top: "0",
              right: "0",
            }}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        ) : null}
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => {
                handleClose();
                option.onClick();
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </MessageContainer>
  );
};

export default Message;

const MessageContainer = styled(Grid)({
  position: "relative",
  padding: "12px",
  borderRadius: "10px",
});
