import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ProfileForm from 'components/profile/ProfileForm';
import LoadingOverlay from 'react-loading-overlay';
import React from 'react';
import AuthContext from 'contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import routes from 'constants/routes';


const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: "100vh",
  },
  main2: {
    width: '86%',
    margin: '4em 0 9em 0',
  },
}))


/**
 * Profile Component
 * Implements the User Profile ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const Profile = ()=>{
  const classes = useStyles();

  const history = useHistory();
  const { authState } = React.useContext(AuthContext);
  const [ loadingActive, setLoadingActive ] = React.useState<boolean>(true);

  React.useEffect(() => {
    // redirect to home if user is not logged in
    if (!authState.isAuthenticated) {
      history.push(routes.HOME);
    }

    // loading overlay
    const timeout = setTimeout(() => {
      setLoadingActive(false);
    }, 1200)
    return () => clearTimeout(timeout)
  }, [loadingActive]);

  return (
    <div className="App">
      <LoadingOverlay
            active={loadingActive}
            spinner
            text='Loading...'
            styles={{
              wrapper: (base) => ({
                ...base,
                height: '100vh'
              })
            }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          className={classes.main}
        >
          <Grid item xs={7} className={classes.main2}>
            <ProfileForm />
          </Grid>
        </Grid>
      </LoadingOverlay>
    </div>
  );
}

export default Profile
