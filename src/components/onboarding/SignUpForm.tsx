import React from 'react';
import cognitoService from 'utils/CognitoService';
import { CognitoSignUp } from 'utils/CognitoServiceTypings'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Joi from 'joi';
import MiscService from 'utils/MiscService';
import { useHistory } from 'react-router';
import routes from 'constants/routes';
import AuthContext from 'contexts/AuthContext';
import { JoiPassword } from "joi-password";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@mui/material/Alert';


interface IError {
    isError: boolean
    message: string | undefined
}


interface IErrors {
    email: IError
    password: IError
}


interface ISnackBarOpen {
    signUpError: boolean
    verifyError: boolean
    verifyInfo: boolean
    signUpSuccess: boolean
}


const useStyles = makeStyles((theme) => ({
    form: {
        width: '97%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    textinput: {
        borderRadius: '11px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
    },
    buttons: {
        textAlign: 'right',
        paddingRight: '8%',
        marginTop: '3%',
    },
    next: {
        width: '13%',
        margin: theme.spacing(2, 0, 1),
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
 * SignUpForm component
 * This SignUpForm component implements
 * the UI for Signing Up. This functional
 * component is used in the SignUpPage as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai
 */
const SignUpForm = () => {
    const classes = useStyles();
    const history =  useHistory()
    const { setAuthState } = React.useContext(AuthContext);

    const [signUpData, setSignUpData] = React.useState<CognitoSignUp>({
        email: '',
        password: '',
        givenName: '',
        familyName: '',
        birthdate: ''
    })

    const [isSignedUp, setIsSignedUp] = React.useState<Boolean>(false);
    const [verificationCode, setVerificationCode] = React.useState<string>('');
    const [errors, setErrors] = React.useState<IErrors>({
        email: { isError: false, message: '' },
        password: { isError: false, message: '' }
    });
    const [snackBarOpen, setSnackBarOpen] = React.useState<ISnackBarOpen>({
        signUpError: false,
        verifyError: false,
        verifyInfo: true,
        signUpSuccess: false
    });
    const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);


    React.useEffect(() => {
        console.log(isSignedUp);
    }, [isSignedUp])

    const onSubmitSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        const onboardingData = MiscService.getOnboardingData();
        MiscService.setOnboardingData(onboardingData);
        const signUpStatus = await cognitoService.signUp(signUpData);
        setIsSignedUp(signUpStatus);
    }

    const onSubmitVerify = async (event: React.FormEvent) => {
        event.preventDefault();
        const isLoggedIn = await cognitoService.verifyUser(signUpData.email, verificationCode);
        if (isLoggedIn) {
            setAuthState((prevState)=>({
                ...prevState,
                isAuthenticated: true,
                email: signUpData.email
            }));
            setSnackBarOpen((prevState) => ({
                ...prevState,
                signUpSuccess: true
            }))
            setTimeout(() => {
                history.push(routes.LOGIN);
            }, 150)
        } else {
            setSnackBarOpen((prevState) => ({
                ...prevState,
                verifyInfo: false,
                verifyError: true
            }))
        }
    }

    const onBlurHandler = async (event: React.FormEvent) => {
        setButtonDisabled(false);
        setErrors(prevState => ({
            email: { isError: false, message: '' },
            password: { isError: false, message: '' }
        }))
        const emailValidate = Joi.string().email({ tlds: { allow: false } }).validate(signUpData.email, {
            messages: {
                'string.email': 'Invalid email format'
            }
        });
        const passwordValidate = JoiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces().validate(signUpData.password, {
            messages: {
                'string.pattern.base': 'Invalid password format. Password should contain at least 8 characters'
            }
        });

        if (emailValidate.error) {
            setErrors(prevState => ({
                ...prevState,
                email: { isError: true, message: emailValidate.error?.message }
            }))
            setButtonDisabled(true);
        }

        if (passwordValidate.error) {
            setErrors(prevState => ({
                ...prevState,
                password: { isError: true, message: passwordValidate.error?.message }
            }))
            setButtonDisabled(true);
        }
    }

    const onBack = () => {
        history.push(routes.ONBOARD);
    }

    
    return (
        <>
            {
                isSignedUp ?  
                <form className={classes.form} onSubmit={onSubmitVerify}>
                    <Container style={{textAlign: 'center'}}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            defaultValue=''
                            style={{maxWidth: "80%"}}
                            id="verificationCode"
                            label="Verification Code"
                            autoComplete="new-password"
                            onChange={ event=>setVerificationCode(event.target.value) }
                            inputProps={{"data-testid": "new-password"}}
                            autoFocus
                            InputProps={{
                                className: classes.textinput,
                            }}
                        />
                    </Container>
                    <Container className={classes.buttons}>
                        {/* <Button
                            disableTouchRipple
                            onClick={onBack}
                            className={classes.back}
                        >
                            Back
                        </Button> */}
                        <Button
                            type="submit"
                            className={classes.next}
                        >
                            Submit
                        </Button>
                    </Container>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        open={snackBarOpen.verifyError}
                        autoHideDuration={3300}       
                    >
                        <Alert 
                            onClose={() => setSnackBarOpen((prevState)=>({
                                ...prevState,
                                verifyError: false
                            }))} 
                            severity="error" 
                            sx={{ width: '100%' }}>
                            Invalid verification code, please try again.
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        open={snackBarOpen.verifyInfo}
                        autoHideDuration={3300}       
                    >
                        <Alert 
                            onClose={() => setSnackBarOpen((prevState)=>({
                                ...prevState,
                                verifyInfo: false
                            }))} 
                            severity="info" 
                            sx={{ width: '100%' }}>
                            Please enter your verification code that has been sent to your email.
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        open={snackBarOpen.signUpSuccess}
                        autoHideDuration={3300}       
                    >
                        <Alert 
                            onClose={() => setSnackBarOpen((prevState)=>({
                                ...prevState,
                                signUpSuccess: false
                            }))} 
                            severity="success" 
                            sx={{ width: '100%' }}>
                            Sign up successful. You will be redirected to the login page.
                        </Alert>
                    </Snackbar>
                </form> :
                <form className={classes.form} onSubmit={onSubmitSignUp}>
                    <Container style={{textAlign: 'center'}}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            error={errors.email.isError}
                            fullWidth
                            style={{maxWidth: "80%"}}
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete=""
                            onChange={ event=>setSignUpData(prevState => ({
                                ...prevState,
                                email: event.target.value
                            })) }
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
                            error={errors.password.isError}
                            fullWidth
                            style={{maxWidth: "80%"}}
                            id="password"
                            label="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            onChange={ event=>setSignUpData(prevState => ({
                                ...prevState,
                                password: event.target.value
                            })) }
                            inputProps={{"data-testid": "answer"}}
                            autoFocus
                            InputProps={{
                                className: classes.textinput,
                            }}
                            onBlur={onBlurHandler}
                            helperText={errors.password.message}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            style={{maxWidth: "80%"}}
                            id="givenName"
                            label="Given Name"
                            name="givenName"
                            autoComplete=""
                            onChange={ event=>setSignUpData(prevState => ({
                                ...prevState,
                                givenName: event.target.value
                            })) }
                            inputProps={{"data-testid": "givenName"}}
                            autoFocus
                            InputProps={{
                                className: classes.textinput,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            style={{maxWidth: "80%"}}
                            id="familyName"
                            label="Family Name"
                            name="familyName"
                            autoComplete=""
                            onChange={ event=>setSignUpData(prevState => ({
                                ...prevState,
                                familyName: event.target.value
                            })) }
                            inputProps={{"data-testid": "familyName"}}
                            autoFocus
                            InputProps={{
                                className: classes.textinput,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            style={{maxWidth: "80%"}}
                            id="birthdate"
                            label="Birthdate"
                            name="birthdate"
                            type="date"
                            autoComplete=""
                            onChange={ event=>setSignUpData(prevState => ({
                                ...prevState,
                                birthdate: event.target.value
                            })) }
                            inputProps={{"data-testid": "birthdate"}}
                            autoFocus
                            InputLabelProps={{ shrink: true }}
                        />
                    </Container> 
                    <Container className={classes.buttons}>
                        <Button
                            type="submit"
                            className={classes.next}
                            disabled={buttonDisabled}
                        >
                            Submit
                        </Button>
                        <Button
                            disableTouchRipple
                            onClick={onBack}
                            className={classes.back}
                        >
                            Back
                        </Button>
                    </Container>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        open={snackBarOpen.signUpError}
                        autoHideDuration={3300}       
                    >
                        <Alert 
                            onClose={() => setSnackBarOpen((prevState)=>({
                                ...prevState,
                                signUpError: false
                            }))} 
                            severity="error" 
                            sx={{ width: '100%' }}>
                            Sign up failed. You might have an account registered with the same email.
                        </Alert>
                    </Snackbar>
                </form>
            }
        </>
    )
}

export default SignUpForm;