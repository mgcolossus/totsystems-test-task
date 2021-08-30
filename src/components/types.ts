
export type ChatName = "workChat" | "floodChat";

export type EmojiNative = { native: string };

export interface MessageData {
  messageId: number;
  sender: string;
  messageText: string;
  date: string;
}