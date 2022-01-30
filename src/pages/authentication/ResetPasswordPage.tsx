import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ResetPasswordForm from 'components/authentication/ResetPasswordForm';
import { Paper, Grid } from '@material-ui/core';


const Copyright = ()=>{
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        PathFinder
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: "100vh",
  },
  main2: {
    textAlign: 'center',
  },
  paperDiv: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    marginTop: '8px',
    backgroundColor: theme.palette.secondary.main,
  },
  paper: {
    justifyContent: 'center',
    width: '100%',
    marginTop: '2.5%',
    padding: '6% 3% 5% 3%',
    borderRadius: '16px',
  },
  innerGrid: {
    justifyContent: 'center',
    alignText: 'center',
  }
}))

/**
 * ResetPasswordPage Component
 * Implements the reset password ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai
 */
const ResetPasswordPage = ()=>{
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.main}
    >
      <Grid item xs={6} className={classes.main2}>
        <div className={classes.paperDiv}>
          <Paper className={classes.paper}>
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
            </Box>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <ResetPasswordForm />
          </Paper>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Grid>
    </Grid>
  );
}

export default ResetPasswordPage;