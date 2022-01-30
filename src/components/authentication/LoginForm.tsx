import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import cognitoService from 'utils/CognitoService';
import Container from '@material-ui/core/Container';
import Joi from 'joi';
import AuthContext from 'contexts/AuthContext';
import routes from 'constants/routes';
import Snackbar from '@material-ui/core/Snackbar';
import { useHistory } from 'react-router';
import Alert from '@mui/material/Alert';


interface IError {
    isError: boolean
    message: string | undefined
}


interface IErrors {
    email: IError
}


const useStyles = makeStyles((theme) => ({
    form: {
        width: '97%',
        marginTop: theme.spacing(1),
    },
    formContainer: {
        textAlign: 'center',
    },
    textinput: {
        borderRadius: '11px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
    },
    buttons: {
        textAlign: 'right',
        paddingRight: '8%',
    },
    next: {
        width: '35%',
        margin: theme.spacing(3, 0, 2),
        paddingTop: '1.5%',
        paddingBottom: '1.5%',
        borderRadius: '0px',
        backgroundColor: '#F64C72',
        color: 'black',
        "&:hover": {
            backgroundColor: '#FF5E81',
        }
    },
    back: {
        margin: theme.spacing(2, 2, 1),
        color: '#848484',
        fontSize: '0.8rem',
        textDecorationLine: 'underline',
        "&:hover": {
            background: 'none',
            color: '#545454',
            textDecorationLine: 'underline',
        },
    },
}));

/**
 * LoginForm component
 * This LoginForm component implements
 * the UI for Logging in. This functional
 * component is used in the LoginPage as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai
 */
const LoginForm = () => {

    const classes = useStyles();
    const history = useHistory();

    const { setAuthState } = React.useContext(AuthContext);
    const [ email, setEmail ] = React.useState<string>('');
    const [ password, setPassword ] = React.useState<string>('');

    const [errors, setErrors] = React.useState<IErrors>({
        email: { isError: false, message: '' }
    });
    const [snackBarOpen, setSnackBarOpen] = React.useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(false);

    /**
     * Function that executes on valid form submission
     */
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const isLoggedIn = await cognitoService.logIn(email, password);
        if (isLoggedIn) {
            setAuthState((prevState)=>({
                ...prevState,
                isAuthenticated: true,
                email: email
            }))
            setSnackBarOpen(false);
            history.push(routes.DATALANDING)
        } else {
            setSnackBarOpen(true);
        }
    }

    const onBlurHandler = async (event: React.FormEvent) => {
        setErrors({
            email: { isError: false, message: '' }
        });
        setButtonDisabled(false)
        const emailValidate = Joi.string().email({ tlds: { allow: false } }).validate(email, {
            messages: {
                'string.email': 'Invalid email format'
            }
        });

        if (emailValidate.error) {
            setErrors(prevState => ({
                ...prevState,
                email: { isError: true, message: emailValidate.error?.message }
            }))
            setButtonDisabled(true);
        }
    }

    return (
        <form className={classes.form} onSubmit={onSubmit}>
            <Container className={classes.formContainer}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    error={errors.email.isError}
                    fullWidth
                    style={{maxWidth: "85%"}}
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete=""
                    onChange={ event => setEmail(event.target.value) }
                    inputProps={{"data-testid": "email"}}
                    autoFocus
                    InputProps={{
                        className: classes.textinput,
                    }}
                    onBlur={onBlurHandler}
                    helperText={errors.email.message}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    style={{maxWidth: "85%"}}
                    id="password"
                    label="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={event => setPassword(event.target.value)}
                    inputProps={{"data-testid": "answer"}}
                    autoFocus
                    InputProps={{
                        className: classes.textinput,
                    }}
                />
            </Container>
            
            <Container className={classes.buttons} style={{maxWidth: "85%"}}>

                <Grid container>
                    <Grid item xs>
                        <Link href={routes.FORGET_PASSWORD} variant="body2" >
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid container>
                        <Grid item xs>
                            <Link href={routes.TOC} variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
                
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.next}
                    disabled={buttonDisabled}
                >
                    Sign In
                </Button>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={snackBarOpen}
                    autoHideDuration={3300}       
                >
                    <Alert onClose={() => setSnackBarOpen(false)} severity="error" sx={{ width: '100%' }}>
                        Login Fail
                    </Alert>
                </Snackbar>
                
            </Container>
        </form>
    )
}

export default LoginForm;