import React, { useState, useEffect, useRef } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import DoneIcon from "@material-ui/icons/Done";
import { Message } from "./Message";
import { ChatName, EmojiNative } from "./types";
import { useStoreContext } from "../contexts/StoreContext";
import { observer } from "mobx-react-lite";
import "emoji-mart/css/emoji-mart.css";
import { EmojiData, Picker } from "emoji-mart";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface Props {
  selectedChat: ChatName;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    emojiPickerAnchor: {
      position: "relative",
    },
  })
);

export const ChatBox = observer(({ selectedChat }: Props) => {
  const classes = useStyles();
  const [newMessageText, setNewMessageText] = useState("");
  const [changingMessageId, setChangingMessageId] = useState<null | number>(null);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [changingMessageText, setChangingMessageText] = useState("");
  const { chatsStore, authStore } = useStoreContext();
  const messageBoxBottomDivRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const prevMessageCount = useRef<number>(0);
  const prevRenderSelectedChat = useRef<ChatName>(selectedChat);
  const widthBreakpoint = useMediaQuery("(max-width:600px)");

  const selectedChatData = selectedChat === "workChat" ? chatsStore.chatsData.workChat : chatsStore.chatsData.floodChat;

  const scrollToBottomOfMessages = () => {
    if (messageBoxBottomDivRef.current) {
      messageBoxBottomDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottomOfMessages();
  }, []);

  useEffect(() => {
    if (selectedChatData.length > prevMessageCount.current && prevRenderSelectedChat.current === selectedChat) {
      scrollToBottomOfMessages();
    }
  }, [selectedChatData.length, selectedChat]);

  useEffect(() => {
    setChangingMessageText("");
    setChangingMessageId(null);
    setIsEmojiPickerVisible(false);
  }, [selectedChat]);

  useEffect(() => {
    prevMessageCount.current = selectedChatData.length;
    prevRenderSelectedChat.current = selectedChat;
  });

  const onTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (changingMessageId) {
      setChangingMessageText(e.target.value);
    } else {
      setNewMessageText(e.target.value);
    }
  };

  const sendMessage = () => {
    if (newMessageText.trim().length > 0 && authStore.authData.currentUser?.login) {
      chatsStore.addMessage(selectedChat, authStore.authData.currentUser.login, newMessageText);
      setNewMessageText("");
    }
  };

  const finishChangingMessage = () => {
    if (changingMessageText.trim().length > 0 && changingMessageId) {
      chatsStore.changeMessage(changingMessageId, selectedChat, changingMessageText);
      setChangingMessageText("");
      setChangingMessageId(null);
    }
  };

  const onTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (changingMessageId) {
        finishChangingMessage();
      } else {
        sendMessage();
      }
    }
  };

  const onEmojiSelect = (emojiData: EmojiData) => {
    const data = emojiData as EmojiNative;
    if (changingMessageId) {
      setChangingMessageText((prev) => prev + data.native);
    } else {
      setNewMessageText((prev) => prev + data.native);
    }
  };

  return (
    <>
      <div className={classes.messagesBoxWrapper}>
        <Grid container direction="column" spacing={2}>
          {selectedChatData.map((messageData) => (
            <Message
              key={messageData.messageId}
              sender={messageData.sender}
              isSenderCurrentUser={messageData.sender === authStore.authData.currentUser?.login}
              isMessageChanging={messageData.messageId === changingMessageId}
              messageText={messageData.messageText}
              date={messageData.date}
              onMessageDelete={() => chatsStore.deleteMessage(messageData.messageId, selectedChat)}
              onMessageChange={() => {
                setChangingMessageId(messageData.messageId);
                setChangingMessageText(messageData.messageText);
                if (messageInputRef.current) {
                  messageInputRef.current.focus();
                }
              }}
            />
          ))}
          <div ref={messageBoxBottomDivRef}></div>
        </Grid>
      </div>
      <div className={classes.newMessageInputWrapper}>
        <TextField
          inputRef={messageInputRef}
          placeholder="Введите текст сообщения"
          fullWidth
          value={changingMessageId ? changingMessageText : newMessageText}
          onChange={onTextInputChange}
          onKeyDown={onTextInputKeyDown}
        />
        <IconButton
          onClick={() => {
            setIsEmojiPickerVisible((prev) => !prev);
          }}>
          <EmojiEmotionsIcon />
        </IconButton>
        <div className={classes.emojiPickerAnchor}>
          {isEmojiPickerVisible ? (
            <Picker
              onSelect={onEmojiSelect}
              style={{
                position: "absolute",
                bottom: "40px",
                right: widthBreakpoint ? "-50px" : "0px",
                width: widthBreakpoint ? "300px" : "354px",
                zIndex: 10000,
              }}
            />
          ) : null}
        </div>
        {changingMessageId ? (
          <IconButton onClick={finishChangingMessage}>
            <DoneIcon />
          </IconButton>
        ) : (
          <IconButton onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        )}
      </div>
    </>
  );
});
