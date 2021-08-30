import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React from "react";
import { useStoreContext } from "../contexts/StoreContext";
import { authStore } from "../stores/authStore";
import { ChatName } from "./types";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    threeDotMenuButtonWrapper: {
      display: "flex",
      justifyContent: "flex-end",
      flexGrow: 1,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    drawerTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
  })
);

interface Props {
  isDrawerOpen: boolean;
  menuAnchorEl: null | HTMLElement;
  selectedChat: ChatName;
  openDrawer: () => void;
  openMenu: (event: React.MouseEvent<HTMLElement>) => void;
  closeMenu: () => void;
}

export const MainPageAppBar = ({
  isDrawerOpen,
  menuAnchorEl,
  selectedChat,
  openDrawer,
  openMenu,
  closeMenu,
}: Props) => {
  const classes = useStyles();
  const { chatsStore } = useStoreContext();

  const onImportMessagesButtonClick = () => {
    closeMenu();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", function (event: any) {
      const file = event.target.files[0];
      let reader = new FileReader();

      reader.onload = function (event) {
        if (event) {
          console.log(event.target?.result);
          const messages = JSON.parse(event.target?.result as string);
          chatsStore.addMessagesFromParsedFile(messages);
        }
      };

      reader.readAsText(file);
    });
    input.click();
  };
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isDrawerOpen,
      })}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={openDrawer}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: isDrawerOpen,
          })}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {selectedChat === "workChat" ? "Рабочий чат" : "Флудилка"}
        </Typography>
        <div className={classes.threeDotMenuButtonWrapper}>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={openMenu}
            color="inherit">
            <MoreVertIcon />
          </IconButton>
        </div>
        <Menu anchorEl={menuAnchorEl} keepMounted open={!!menuAnchorEl} onClose={closeMenu}>
          <MenuItem onClick={onImportMessagesButtonClick}>Импорт сообщений</MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              authStore.logOut();
            }}>
            Выйти
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
