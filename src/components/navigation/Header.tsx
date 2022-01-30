import {
    AppBar,
    Toolbar,
    makeStyles,
    Button,
    IconButton,
    Grid,
    Avatar,
    Drawer,
    Link,
    MenuItem,
    Menu,
    Typography,
  } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {useState, useEffect} from "react";
import * as React  from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import routes from 'constants/routes';
import pathFinderIcon from '../../icon.png';
import AuthContext, { authContextDefaultValue } from 'contexts/AuthContext';
import LogoutButton from "components/authentication/LogoutButton";
import Box from "@mui/material/Box";

  const headersData = [
    {
      label: "My Data",
      href: "/mydata",
    },
    {
      label: "Housing Recommendation",
      href: "/housingrecommendation",
    },
    {
      label: "Insurance Recommendation",
      href: "/insurancerecommendation",
    },
  ];
  
  const useStyles = makeStyles((theme) => ({
    header: {
      backgroundColor: "white",
    },

    logo: {
      color: "black",
      textAlign: "left", 
    },

    menuButton: {
      fontWeight: "normal",
      color: "black",
      size: "18px",
      marginLeft: "38px", 
    },

    toolbar: {
      display:"flex",
      justifyContent: "space-between",
    },

    drawerContainer: {
      padding: "20px 30px",
    }

  }));
  
  
  /**
   * Header component
   * This Header component implements
   * the UI for the navigation bar of the application
   * when users are logged in. 
   * @returns {JSX.Element}
   * 
   * @author Sokunthea
   */
  export default function Header() {
    const classes = useStyles();

    const { authState, setAuthState } = React.useContext(AuthContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const [state, setState] = useState({mobileView:false, drawerOpen:false});
    const {mobileView, drawerOpen} = state;
  
    useEffect(() => {
      const setResponsiveness = () => {
        return window.innerWidth <900
          ? setState((prevState) => ({...prevState, mobileView: true}))
          : setState((prevState) => ({...prevState, mobileView:false}));
      };
  
      setResponsiveness();
      window.addEventListener("resize", () => setResponsiveness());
      return() => {
        window.removeEventListener("resize", () => setResponsiveness());
      };
    },[]); 
                       
    const displayDesktop = () => {
      return (
        <Toolbar className={classes.toolbar}>
            {pathFinderLogo}
            {getMenuButtons()}
            {profileIcon}
        </Toolbar>
      );
    };

    const displayMobile = () => {
      const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
      const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

      return (
        <Toolbar>
          <IconButton
            {...{
              edge: "start",
              color: "default", 
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}>
          <div className = {classes.drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>

          <div>{pathFinderLogo}</div>
          <div>{profileIcon}</div>
       </Toolbar>
      );
    };

    const getDrawerChoices = () => {
      return headersData.map(({ label, href }) => {
        return (
          <Link
            {...{
              component: RouterLink,
              to: href,
              color: "inherit",
              style: { textDecoration: "none" },
              key: label,
            }}
          >
            <MenuItem>{label}</MenuItem>
          </Link>
        );
      });
    };

    const pathFinderLogo = (
      <Toolbar>
        <Link href={routes.DATALANDING}> <img src={pathFinderIcon} alt="logo" className={classes.logo} style={{height: "50px"}}/> </Link>
        <Typography variant="h6" component="h1" className={classes.logo}>
        <Link href={routes.DATALANDING}> <Box sx={{ fontWeight: 'bold', color: 'black' }} display='inline'>PathFinder</Box> </Link>
        </Typography>
      </Toolbar>
    );
                       
    const getMenuButtons = () => {
      return headersData.map(({ label, href }) => {
        return (
            <Button
              {...{
                key: label,
                color: "default",
                to: href,
                component: RouterLink,
                className: classes.menuButton,
              }}>
              {label} 
            </Button>
        );
      });
    };

    const profileIcon = (
      <Grid container justify="flex-end">
            {authState.isAuthenticated && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar src="/broken-image.jpg"/>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} ><Link href={routes.PROFILE}> My Profile </Link></MenuItem>
                  <LogoutButton handleClose={handleClose}/>
                </Menu>
              </div>
            )}     
      </Grid>
    );
                  
    return (
      <header>
        <AppBar className={classes.header}>
         {mobileView ? displayMobile(): displayDesktop()}
        </AppBar>
      </header>
    );
  }