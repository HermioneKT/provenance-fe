import React from 'react';
import { makeStyles, Container, Grid } from '@material-ui/core';
import IncomeChart from 'components/dashboard/IncomeChart';
import HouseChart from 'components/dashboard/HouseChart';
import InsuranceChart from 'components/dashboard/InsuranceChart';
import APIService from "utils/ApiService";
import AuthContext from 'contexts/AuthContext';
import {useHistory} from 'react-router-dom';
import routes from 'constants/routes';
import LoadingOverlay from 'react-loading-overlay';



const useStyles = makeStyles((theme) => ({
  root:{
    margin: '6em auto 9em auto',
  },

  container1: {
    marginTop: "5%",
    minWidth: "100% 24px 1.5%",
    padding: "5%",
  },
}));


/**
 * Dashboard Component
 * Implements the DataLanding ui.
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const {authState} = React.useContext(AuthContext);
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

  React.useEffect(() => {
    const getUserData = async () => {
      const response = await APIService.getDashboard();

      if (response) {
        console.log(response)
        const userDetails = response.body.User;
        console.log(userDetails)
        setDetails(userDetails);
      }
    }
    console.log(details)
    getUserData();
  },[]);
  const [details, setDetails ] = React.useState<{ [key: string]: any }>({"Quartile": "NA", "Monthly income": "NA", "House Type": "NA", "No of rooms": "NA"});
  return(
    <Container  className={classes.root}>
      <Grid container spacing ={5}>
        <Grid item xs={7}>
        <p style={{textAlign: "center", textDecoration:"underline"}}> Average Monthly Household Income by Income Quintile and Type of Dwelling</p>
        <HouseChart />
          <p style={{textAlign: "center", fontSize: "1.5em"}}> 
            <span style={{fontWeight:"bold", textAlign:"left"}}> Your House:  </span>   {details["House Type"]} <br/>
            <span style={{fontWeight:"bold", textAlign:"left"}}> Your Income:  </span> {details["Monthly income"]} SGD <br/>
            <span style={{fontWeight:"bold", textAlign:"left"}}> Your Quartile:  </span>  {details["Quartile"]} <br/>
          </p>
        </Grid>
        <Grid item xs={5} style={{gridTemplateColumns: 'repeat(autoFill, 200 px)'}}>
          <p style={{textAlign: "center", textDecoration:"underline"}}> Insurance Policies issued by Percentage </p>
          <InsuranceChart />
        </Grid>
      </Grid>
      <div className ={classes.container1}>
      <p style={{textAlign: "center", textDecoration:"underline"}}> Average Monthly Household Income from Work by Income Quintile</p>
        <IncomeChart />
      </div>
    </Container>
  );
}


export default Dashboard;