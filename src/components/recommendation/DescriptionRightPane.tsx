import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Grid, Snackbar, SnackbarContent, Typography } from '@material-ui/core';
import React from 'react';
import { Theme } from '@material-ui/core';
import APIService from 'utils/ApiService';


interface IProps {
  bgColor: string
  data: {
    logo: string
    address: string
    type: string
    item_id: string
  }
}

const useStyles = makeStyles<Theme, IProps> ((theme) => ({
  paneGrid: props => ({
    backgroundColor: props.bgColor,
    height: '77.3vh',
    justifyContent: 'center',
    padding: '0 14% 0 14%',
  }),
  subGrid: {
    margin: '14px 0 14px 0',
  },
  logoGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: '20vh',
    width: '20vh',
  },
  companyDescriptionText: {
    color: '#C5C5C5',
  },
  button: {
    padding: '3% 8% 3% 8%',
    borderRadius: '0px',
    backgroundColor: '#F64C72',
    color: '#E8E8E8',
    fontSize: '1.2rem',
    "&:hover": {
        backgroundColor: '#FF5E81',
        color: '#EAEAEA'
    }
  }
}))


/**
 * DescriptionRightPane Component
 * Implements the Housing/Insurance Description Right Pane ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const DescriptionRightPane = (props: IProps) => {
  const classes = useStyles(props);

  const [ snackbar, setSnackbar ] = React.useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: "" });

  const onClickInterest  = async (event: React.FormEvent) => {
    event.preventDefault();
    var snackbarMessage: string = "";
    
    // send API to create interest
    const m = await APIService.createInterest(props.data.type, props.data.item_id);
    if (m && m.body === "success") {
      snackbarMessage = "Your interest has been registered, you will be contacted by a representative of the company!";
    } else {
      snackbarMessage = "Interest could not be registered, please try again later.";
    }
    setSnackbar({ isOpen: true, message: snackbarMessage });
  }

  return (
    <div>
      <Grid container direction="column" spacing={0} className={classes.paneGrid}>
        <Grid item className={classes.subGrid}>
          <Grid item className={classes.logoGrid}>
            <Avatar
              alt="Company Logo"
              src={props.data.logo}
              className={classes.logo}
            />
          </Grid>
        </Grid>
        <Grid item className={classes.subGrid}>
          <Typography component="h1" variant="body1" className={classes.companyDescriptionText}>
            {props.data.address}
          </Typography>
        </Grid>
        <Grid item className={classes.subGrid}>
          <Button
            onClick={onClickInterest}
            className={classes.button}
          >
            I'm Interested!
          </Button>
          <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            style={{
              marginTop: '80px'
            }}
            open={snackbar.isOpen}
            autoHideDuration={3300}
            onClose={()=>{setSnackbar({ isOpen: false, message: "" })}}          
          >
            <SnackbarContent
              style={{
                backgroundColor: '#474747',
              }}
              message={<Typography component="h1" variant="body1">{snackbar.message}</Typography>}
            />
          </Snackbar>
        </Grid>
      </Grid>
    </div>
  );
}

export default DescriptionRightPane
