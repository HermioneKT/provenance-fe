import {
    AppBar,
    Toolbar,
    makeStyles,
    Button,
    Grid,
    Link,
  } from "@material-ui/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import routes from "constants/routes";
import React from "react";
import pathFinderIcon from '../../icon.png';

                     
const useStyles = makeStyles((theme) => ({
    header: {
        backgroundColor: "white",
      },
  
    logo: {
        color: "black",
        textAlign: "left", 
      },
  
    menuButton: {
        color: "black",
        size: "18px",
        marginLeft: "38px", 
        marginRight: "38px", 
      },

}));

/**
 * Header component
 * This Header component implements
 * the UI for the navigation bar of the application
 * when users are not logged in. 
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
export default function Header() {
  const classes = useStyles();
                     
  const displayDesktop = () => {
    return (
      <Toolbar>
          {pathFinderLogo}
          {getStarted}
      </Toolbar>
    );
  };
                     
  const pathFinderLogo = (
    <Toolbar>
      <Link href={routes.HOME}> <img src={pathFinderIcon} alt="logo" className={classes.logo} style={{height: "50px"}}/> </Link>
      <Typography variant="h6" component="h1" className={classes.logo}>
      <Link href={routes.HOME}> <Box sx={{ fontWeight: 'bold', color: 'black' }} display='inline'>PathFinder</Box> </Link>
      </Typography>
    </Toolbar>
  );
                     

  const getStarted = (
    <Grid container justify="flex-end">
        <Button variant="text" href={routes.LOGIN} className={classes.menuButton}>Sign In </Button>
        <Button variant="outlined" color="secondary" href={routes.TOC}>
        Get Started
        </Button>
    </Grid>
  );
                     
  return (
    <header>
      <AppBar className={classes.header}>{displayDesktop()}</AppBar>
      
    </header>
  );
}