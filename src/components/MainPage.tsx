import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { ChatBox } from "./ChatBox";
import { MainPageAppBar } from "./MainPageAppBar";
import { MainPageDrawer } from "./MainPageDrawer";
import { ChatName } from "./types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      paddingTop: `calc(${theme.spacing(3)}px + 64px)`,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1),
        paddingTop: `calc(${theme.spacing(1)}px + 56px)`,
      },
    },
    messagesBoxWrapper: {
      height: "calc(100% - 64px)",
      overflowY: "auto",
      padding: "8px",
    },
    newMessageInputWrapper: {
      height: "64px",
      padding: "10px",
      display: "flex",
      alignItems: "center",
    },
  })
);

export const MainPage = observer(() => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChat, setSelectedChat] = useState<ChatName>("workChat");

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const switchChat = (chatName: ChatName) => {
    setSelectedChat(chatName);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <MainPageAppBar
        isDrawerOpen={isDrawerOpen}
        menuAnchorEl={menuAnchorEl}
        selectedChat={selectedChat}
        openDrawer={openDrawer}
        openMenu={openMenu}
        closeMenu={closeMenu}
      />
      <MainPageDrawer
        isDrawerOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
        selectedChat={selectedChat}
        switchChat={switchChat}
      />
      <main className={classes.content}>
        <ChatBox selectedChat={selectedChat} />
      </main>
    </div>
  );
});
