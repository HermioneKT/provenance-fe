import {
  Grid,
  Button,
  Container,
  } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import routes from "constants/routes";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  foot: {
    backgroundColor: "#242582",
    fontFamily: "Inter",
    fontWeight: 600,
    color: "#FFFEFE",
    textAlign: "center",
    position: "sticky",
    width: "100%",
    padding: "2em 0",
    bottom: "0",
    marginBottom: "0",
    marginTop: "0",

    },
}));

/**
 * Footer component
 * This HouseChart component implements
 * the UI for Footer. 
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
export default function Footer() {
  const classes = useStyles();
  const FooterData = [
      {
        label: "Terms and Conditions",
        href: routes.TOC,
      },
      {
        label: "Contact Us",
        href: "/contactus",
      },
      {
        label: "About Us",
        href: "/aboutus",
      },
    ];
                                                
  const displayDesktop = () => {
    return (
      <Grid>   
        {getMenuButtons()}
      </Grid>
    );
  };

  const getMenuButtons = () => {
      return FooterData.map(({ label, href }) => {
        return (
          <Container maxWidth ="lg">
              <Grid container spacing ={3} justify ="center">
                  <Button
                  {...{
                      key: label,
                      color: "inherit",
                      to: href,
                      component: RouterLink,
                  }}
                  >
                  {label}
                  </Button>
            </Grid>
          </Container>
        );
      });
    };

  return (
    <div >
      <p className={classes.foot}>{displayDesktop()} </p>
      </div>
    );

};
