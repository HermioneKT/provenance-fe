import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import React from 'react';
import AuthContext from 'contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import routes from 'constants/routes';
import DescriptionLeftPane from 'components/recommendation/DescriptionLeftPane';
import DescriptionRightPane from 'components/recommendation/DescriptionRightPane';
import RecommendationContext from 'contexts/RecommendationContext';


const useStyles = makeStyles((theme) => ({
  main: {
    padding: '7em 2em 9em 2em',
  },
}))

/**
 * Description Component
 * Implements the Housing/Insurance Description ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const Description = ()=>{
  const classes = useStyles();

  const history = useHistory();
  const { authState } = React.useContext(AuthContext);

  const {recommendationState} =  React.useContext(RecommendationContext);
  const [ leftPaneProps, setLeftPaneProps ] = React.useState<any>({});
  const [ rightPaneProps, setRightPaneProps ] = React.useState<any>({});

  React.useEffect(() => {
    // redirect to home if user is not logged in
    if (!authState.isAuthenticated) {
      history.push(routes.HOME);
    }

    // extract recommendationState data for passing as props
    const { type, data } = recommendationState;
    setLeftPaneProps({ item_type: type, ...data });
    if (recommendationState.type === "house") {
      const { data: {company_address, logo_url, house_id} } = recommendationState;
      setRightPaneProps({ logo: logo_url, address: company_address, type: type, item_id: house_id });
    } else {
      const { data: {company_address, logo_url, plan_id} } = recommendationState;
      setRightPaneProps({ logo: logo_url, address: company_address, type: type, item_id: plan_id });
    }
  }, []);

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        className={classes.main}
      >
        <Grid item xs={6}>
          <DescriptionLeftPane data={leftPaneProps} />
        </Grid>
        <Grid item xs={6}>
          { recommendationState.type === "house" ? <DescriptionRightPane bgColor="#553D67" data={rightPaneProps} /> : <DescriptionRightPane bgColor="#242582" data={rightPaneProps} />}
        </Grid>
      </Grid>
    </div>
  );
}

export default Description
