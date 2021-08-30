import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      padding: theme.spacing(1),
      wordBreak: "break-all",
      display: "inline-block",
    },
    changingMessage: {
      backgroundColor: "rgb(222, 222, 222)",
    },
    sender: {
      fontWeight: 700,
      color: "#4C77A5",
      flex: "1",
    },
    messageTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    messageActions: {
      margin: "0 0 0 20px",
      userSelect: "none",
      "& span": {
        fontSize: "24px",
        margin: "0 8px",
        cursor: "pointer",
        userSelect: "none",
      },
    },
    hide: {
      display: "none",
    },
    date: {
      fontSize: "12px",
      color: "#676666",
    },
    messageWrapper: {
      display: "flex",
    },
  })
);

interface Props {
  sender: string;
  isSenderCurrentUser: boolean;
  isMessageChanging: boolean;
  messageText: string;
  date: string;
  onMessageDelete: () => void;
  onMessageChange: () => void;
}

export const Message = ({
  sender,
  isSenderCurrentUser,
  isMessageChanging,
  messageText,
  date,
  onMessageDelete,
  onMessageChange,
}: Props) => {
  const classes = useStyles();
  return (
    <Grid item className={classes.messageWrapper}>
      <Paper
        className={clsx(classes.message, isMessageChanging && classes.changingMessage)}
        elevation={0}
        variant="outlined">
        <div className={classes.messageTop}>
          <Typography className={classes.sender} variant="subtitle1">
            {sender}
          </Typography>
          <div
            className={clsx(
              classes.messageActions,
              !isSenderCurrentUser && classes.hide,
              isMessageChanging && classes.hide
            )}>
            <span onClick={onMessageDelete}>×</span>
            <span onClick={onMessageChange}>✏</span>
          </div>
        </div>
        <Typography variant="body1">{messageText}</Typography>
        <Typography variant="body2" align="right" className={classes.date}>
          {date}
        </Typography>
      </Paper>
    </Grid>
  );
};
