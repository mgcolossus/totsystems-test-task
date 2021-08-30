import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { SignUpPage } from "./components/SignUpPage";
import { SignInPage } from "./components/SignInPage";
import { MainPage } from "./components/MainPage";
import "./App.css";
import { authStore } from "./stores/authStore";
import { observer } from "mobx-react-lite";
import { StoreContextProvider } from "./contexts/StoreContext";

export const App = observer(() => {
  const { currentUser } = authStore.authData;
  return (
    <StoreContextProvider>
      <Router>
        <Switch>
          <Route path="/signup">{currentUser ? <Redirect to="/" /> : <SignUpPage />}</Route>
          <Route path="/signin">{currentUser ? <Redirect to="/" /> : <SignInPage />}</Route>
          <Route path="/">{currentUser ? <MainPage /> : <Redirect to="/signin" />}</Route>
        </Switch>
      </Router>
    </StoreContextProvider>
  );
});
