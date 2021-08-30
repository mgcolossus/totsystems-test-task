import { makeAutoObservable } from "mobx";

interface AuthData {
  currentUser: null | { login: string };
  users: { login: string; password: string }[];
}

class AuthStore {
  authData: AuthData = {
    currentUser: null,
    users: [],
  };
  error: null | string = null;
  constructor() {
    makeAutoObservable(this);
    this.loadSavedData();
  }
  loadSavedData() {
    let dataFromLocalStorage = localStorage.getItem("authData");
    if (dataFromLocalStorage) {
      this.authData = JSON.parse(dataFromLocalStorage);
    }
  }
  signIn(login: string, password: string) {
    this.error = null;
    if (this.authData.users) {
      const user = this.authData.users.filter((user) => user.login === login && user.password === password);
      if (user.length === 1) {
        this.authData.currentUser = { login: user[0].login };
        localStorage.setItem("authData", JSON.stringify(this.authData))
      } else if (user.length === 0) (
        this.error = "Введите правильные авторизационные данные"
      );
    }
  }
  signUp(login: string, password: string) {
    this.error = null;
    if (this.authData.users) {
      const isUserAlreadySignedUp = this.authData.users.some(user => user.login === login);
      if (isUserAlreadySignedUp) {
        this.error = "Пользователь с введенным логином уже существует"
      } else {
        this.authData.users.push({ login, password });
        this.authData.currentUser = {login}
        localStorage.setItem("authData", JSON.stringify(this.authData))
      }
    }
  }
  logOut() {
    this.authData.currentUser = null;
    localStorage.setItem("authData", JSON.stringify(this.authData))
  }
  cleanError() {
    this.error = null;
  }
}

export const authStore = new AuthStore();
