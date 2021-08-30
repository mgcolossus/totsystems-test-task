import React from "react";
import { authStore } from "../stores/authStore";
import { chatsStore } from "../stores/chatsStore";

type ContextProps = {
  authStore: typeof authStore;
  chatsStore: typeof chatsStore;
};

const StoreContext = React.createContext({} as ContextProps);

export const StoreContextProvider: React.FC = ({ children }) => {
  return <StoreContext.Provider value={{ authStore, chatsStore }}>{children}</StoreContext.Provider>;
};

export const useStoreContext = () => React.useContext(StoreContext);