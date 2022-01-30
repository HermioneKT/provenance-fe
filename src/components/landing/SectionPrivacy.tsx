import React from "react";
import {Typography, makeStyles, Box, Paper} from '@material-ui/core';

interface IProps{
  id: string
  title: string
  color: string
}

/**
 * Section component
 * This HouseChart component implements
 * the UI for sections. This functional
 * component is used in the LandingPage as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */

 const useStyles = makeStyles((theme) => ({
  sectionContent: {
    maxWidth: '80%',
    color: 'white',
    paddingTop:'auto',
    paddingBottom:' 25px',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tncpaper: {
    maxHeight: 490,
    width: '100%',
    overflow: 'auto',
    marginTop: '1.5%',
    marginBottom: '1%',
    padding: '2% 1% 2% 2%',
    textAlign: 'left',
    backgroundColor: '#FDFBFF',
    elevation: 4,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100vh',
    background: '#242582',
    overflow: 'scroll',
  }
}));
const SectionPrivacy = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={classes.section} style={{background: props.color}} id={props.id}>
      <div className={classes.sectionContent}>
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          <Box sx={{ fontWeight: 'bold' }}>
            PRIVACY FIRST.
          </Box>
        </Typography>
        <Typography component="h2" variant="subtitle1" style={{lineHeight:"1.2em"}}> 
        <br/> We will never sell your data. <br/> Everything remains on this platform. <br/> Here is our privacy policy.
        </Typography>
        <Paper className={classes.tncpaper}>
          <Typography component="h2" variant="h6" style={{ fontWeight: 'bold' }}>Reservation of Rights</Typography>
          <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>
          
          <Typography component="h2" variant="h6" style={{ fontWeight: 'bold' }}>Removal of links from our website</Typography>
          <p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p>
          <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>
          
          <Typography component="h2" variant="h6" style={{ fontWeight: 'bold' }}>Disclaimer</Typography>
          <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>
          <ul style={{textAlign:'left'}}>
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
          <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>
          <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
          </Paper>
      </div>
      </div>
    </div>
  );
}

export default SectionPrivacy;