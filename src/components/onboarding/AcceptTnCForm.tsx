import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import MiscService from 'utils/MiscService';
import { initialOnboardingData } from 'constants/misc';
import { useHistory } from 'react-router';
import routes from 'constants/routes';


const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        textAlign: 'center',
        marginTop: theme.spacing(1),
    },
    submit: {
        width: '11%',
        margin: theme.spacing(2, 0, 1),
        paddingTop: '1%',
        paddingBottom: '1%',
        borderRadius: '0px',
        backgroundColor: '#F64C72',
        color: 'black',
        "&:hover": {
            backgroundColor: '#FF5E81',
        }
    },
    back: {
        color: '#989898',
        fontSize: '0.7rem',
    }
}));

/**
 * AcceptTnCForm component
 * This AcceptTnCForm component implements
 * the UI for the form that accepts terms and conditions. 
 * This functional component is used in the 
 * AcceptTncPage as a child component
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const AcceptTnCForm = () => {

    const classes = useStyles();
    const history = useHistory();

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const getPrevData = MiscService.getOnboardingData();
        if (Object.keys(getPrevData).length === 0) {
            MiscService.setOnboardingData(initialOnboardingData);
        }
        history.push(routes.ONBOARD);
    }

    return (
        <form className={classes.form} onSubmit={onSubmit}>
            <Button
                type="submit"
                className={classes.submit}
            >
                Let's Go!
            </Button>
            <Grid container>
                <Grid item xs>
                <Link href={routes.HOME} variant="subtitle2" className={classes.back}>
                   Take me back
                </Link>
                </Grid>
            </Grid>
        </form>
    )
}

export default AcceptTnCForm;