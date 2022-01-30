import '../../App.css';
import React from 'react';
import {
    CssBaseline,
    makeStyles,
    Button,
    Grid,
} from "@material-ui/core";
import Header from 'components/navigation/Header_notLoggedIn';
import SectionPrivacy from 'components/landing/SectionPrivacy';
import SectionTC from 'components/landing/SectionTC';
import {Link} from "react-scroll";
import { NavLink } from "react-router-dom";
import LandingBackground from '../../landingPageBackground.png';


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '4em',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh',
    minWidth: '100%',
    objectFit: 'contain',
    backgroundImage: `url(${LandingBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },

  text: {
    fontWeight: "bold",
    color: "white",
    textDecoration: "none",
  },

  container: {
    position: "absolute",
    left: "10%",
    top: "4em",
    maxWidth: '800px',
    padding: '40px',
  },

  termContainer: {
    position: "absolute",
    left: "0%",
    top: "100%",
    maxWidth: '800px',
    color: "white",
    marginTop: '6vh',
    padding: '40px', '&:hover': {cursor:"pointer"},
    textDecoration: "underline",
  },
  sectionSmall: {
      display: 'flex',
      flexDirection: 'column',
      minheight: '25vh',
      margin: '0 auto',
      paddingTop:' 50px',
      paddingBottom:' 50px',
      background: 'white',
      color: 'black',
  },
}));


/**
 * LandingPage Component
 * Implements the LandingPage ui.
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
export default function LandingPage() {
  const classes = useStyles();
  return (
  <div>
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <div className={classes.container}>
        <span style={{fontSize:"4.3vw"}} className={classes.text}> Hello there!</span> <br/>
        <span style={{fontSize:"2.25vw"}} className={classes.text}> Wondering what your future looks like? <br/> Take the journey with us. </span> <br/><br/>
        <Button variant="contained" color="secondary" style={{maxWidth: '250px', maxHeight: '88px', minWidth: '50px', minHeight: '50px'}} href="/getstarted">
        Get Started
        </Button>

        <div className={classes.termContainer}>
        <Link
            activeClass="active"
            to="PrivacyPolicy"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
        > Privacy Policy
        </Link> <br/>
        <Link
            activeClass="active"
            to="TermsAndCondition"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
        > Terms and Conditions
        </Link>     
        </div>
      </div>
    </div>

    <div className={classes.sectionSmall}>
    <Grid container spacing={5}>
     <Grid item xs={6}  container justifyContent="center">
        <p style={{textAlign:"center", marginLeft:"120px"}}> <span style={{fontSize:"4vw", color:"black", fontWeight:"bold"}} className={classes.text}> Start Controlling your Life. </span> </p>
     </Grid>
     <Grid item xs={6}  container justifyContent="center">
        <p style={{textAlign:"left", marginRight:"50px"}}> 
        <span style={{fontSize:"2vw", color:"black", fontWeight:"normal"}} className={classes.text}> 
          Take control of your own finances. Whether you are in school or just started out in life, there is no time too early or late. 
          <NavLink to="/getstarted">
            <br/> <span style={{fontSize:"1vw", color:"black", textDecoration:"underline"}} className={classes.text}> Get Started </span>
          </NavLink>
        </span> 
        </p>
      </Grid>
     </Grid>
    </div>

    <SectionPrivacy 
        id="PrivacyPolicy"
        title="Your Policy"
        color= "#242582"
    />

    <SectionTC
        id = 'TermsAndCondition' 
        title="Terms and Conditions"
        color ="#553D67"
    />
  </div>
  );
}