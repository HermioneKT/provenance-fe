import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import SignUpForm from 'components/onboarding/SignUpForm';


const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: "100vh",
  },
  main2: {
    textAlign: 'left',
    width: '86%',
  },
  titlegrid: {
    width: '100%',
    paddingLeft: '5%',
  },
  papergrid: {
    justifyContent: 'center',
  },
  paper: {
    // flexBasis: 'auto',
    justifyContent: 'center',
    width: '100%',
    marginTop: '2.5%',
    paddingTop: '6%',
    paddingBottom: '5%',
    borderRadius: '16px',
    
  },
}))

/**
 * SignUpPage Component
 * Implements the SignUp ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai
 */
const SignUpPage = ()=>{
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
      <Grid item xs={8} className={classes.main2}>
        <Grid item spacing={0} className={classes.titlegrid}>
          <Typography component="h1" variant="h4">
            Onboarding
          </Typography>
          <Typography component="h2" variant="subtitle1" style={{fontSize: '0.8rem'}}>
            You're almost there!
          </Typography>
        </Grid>
        <Grid container spacing={0} className={classes.papergrid}>
          <Paper className={classes.paper}>
            <SignUpForm />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SignUpPage