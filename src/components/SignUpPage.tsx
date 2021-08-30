import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { authStore } from "../stores/authStore";
import { observer } from "mobx-react-lite";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainer: {
      marginTop: theme.spacing(12),
    },
    signUpButtonGridItem: {
      marginTop: theme.spacing(4),
    },
    linkGridItem: {
      textAlign: "center",
    },
  })
);

export const SignUpPage = observer(() => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    authStore.cleanError();
  }, []);

  const onSignUpButtonClick = () => {
    if (login.length > 0 && password.length > 0) {
      authStore.signUp(login, password);
    }
  };


  const onTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && login.length > 0 && password.length > 0) {
      authStore.signUp(login, password);
    }
  };

  const classes = useStyles();
  return (
    <Container maxWidth="xs">
      <Grid container className={classes.gridContainer} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Регистрация
          </Typography>
        </Grid>
        {authStore.error ? (
          <Grid item xs={12}>
            <Typography variant="h5" align="center" color="secondary">
              {authStore.error}
            </Typography>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Логин"
            variant="outlined"
            value={login}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLogin(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="password"
            fullWidth
            label="Пароль"
            variant="outlined"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            onKeyDown={onTextInputKeyDown}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            className={classes.signUpButtonGridItem}
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSignUpButtonClick}>
            Зарегистрироваться
          </Button>
        </Grid>
        <Grid className={classes.linkGridItem} item xs={12}>
          <Link variant="body2" color="primary" component={RouterLink} to="/signin">
            Уже имеете аккаунт? Войти
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
});
