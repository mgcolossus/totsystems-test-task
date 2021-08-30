import { makeAutoObservable } from "mobx";
import moment from "moment";
moment.locale();

type ChatName = "workChat" | "floodChat";

interface Message {
  messageId: number;
  sender: string;
  messageText: string;
  date: string;
}

interface ChatsData {
  workChat: Message[];
  floodChat: Message[];
}

class ChatsStore {
  chatsData: ChatsData = {
    workChat: [],
    floodChat: [],
  };
  constructor() {
    makeAutoObservable(this);
    this.loadChatsDataFromLocalStorage();
  }
  loadChatsDataFromLocalStorage() {
    let dataFromLocalStorage = localStorage.getItem("chatsData");
    if (dataFromLocalStorage) {
      this.chatsData = JSON.parse(dataFromLocalStorage);
    }
  }
  addMessage(chatName: ChatName, sender: string, messageText: string) {
    if (chatName === "workChat") {
      this.chatsData.workChat.push({
        messageId: Date.now(),
        sender,
        messageText,
        date: moment().format("DD/MM/YYYY HH:mm"),
      });
    } else {
      this.chatsData.floodChat.push({
        messageId: Date.now(),
        sender,
        messageText,
        date: moment().format("DD/MM/YYYY HH:mm"),
      });
    }
    localStorage.setItem("chatsData", JSON.stringify(this.chatsData));
  }
  deleteMessage(messageId: number, chatName: ChatName) {
    if (chatName === "workChat") {
      this.chatsData.workChat = this.chatsData.workChat.filter((messageData) => messageData.messageId !== messageId);
    } else {
      this.chatsData.floodChat = this.chatsData.floodChat.filter((messageData) => messageData.messageId !== messageId);
    }
    localStorage.setItem("chatsData", JSON.stringify(this.chatsData));
  }
  changeMessage(messageId: number, chatName: ChatName, newText: string) {
    if (chatName === "workChat") {
      const index = this.chatsData.workChat.findIndex((messageData) => messageData.messageId === messageId);
      if (index !== -1) {
        this.chatsData.workChat[index].messageText = newText;
      }
    } else {
      const index = this.chatsData.floodChat.findIndex((messageData) => messageData.messageId === messageId);
      if (index !== -1) {
        this.chatsData.floodChat[index].messageText = newText;
      }
    }
    localStorage.setItem("chatsData", JSON.stringify(this.chatsData));
  }
  addMessagesFromParsedFile(messages: any) {
    if (messages && messages.workChat && messages.floodChat) {
      this.chatsData.workChat = [...messages.workChat, ...this.chatsData.workChat];
      this.chatsData.floodChat = [...messages.floodChat, ...this.chatsData.floodChat];
    }
  }
}

export const chatsStore = new ChatsStore();
