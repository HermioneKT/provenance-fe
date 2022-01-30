import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import cognitoService from 'utils/CognitoService';
import Container from '@material-ui/core/Container';
import Joi from 'joi';
import { JoiPassword } from "joi-password";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@mui/material/Alert';
import { useHistory } from 'react-router';
import routes from 'constants/routes';



interface IError {
    isError: boolean
    message: string | undefined
}

interface IErrors {
    email: IError
    password: IError
}

interface ISnackBarOpen {
    verifyError: boolean
    verifyInfo: boolean
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
    },
    next: {
        width: '50%',
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
 * ResetPasswordForm component
 * This ResetPasswordForm component implements
 * the UI for resetting password. This functional
 * component is used in the ResetPasswordPage as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai
 */
const ResetPasswordForm = () => {

    const classes = useStyles();
    const history = useHistory()

    const [ email, setEmail ] = React.useState<string>('');
    const [ password, setPassword ] = React.useState<string>('');
    const [ verificationCode, setVerificationCode ] = React.useState<string>('');


    const [errors, setErrors] = React.useState<IErrors>({
        email: { isError: false, message: '' },
        password: { isError: false, message: '' }
    });
    const [snackBarOpen, setSnackBarOpen] = React.useState<ISnackBarOpen>({
        verifyInfo: true,
        verifyError: false
    });

    /**
     * Function that executes on valid form submission
     */
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const isReset = await cognitoService.confirmPassword(email, password, verificationCode);
        if (isReset) {
            history.push(routes.LOGIN)
        } else {
            alert("Reset password failed");
            setSnackBarOpen((prevState) => ({
                ...prevState,
                verifyError: true
            }))
        }
    }

    const onBlurHandler = async (event: React.FormEvent) => {
        setErrors({
            email: { isError: false, message: '' },
            password: { isError: false, message: '' }
        })
        const emailValidate = Joi.string().email({ tlds: { allow: false } }).validate(email, {
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
        .noWhiteSpaces().validate(password, {
            messages: {
                'string.pattern.base': 'Invalid password format. Password should contain at least 8 characters'
            }
        });

        if (emailValidate.error) {
            setErrors(prevState => ({
                ...prevState,
                email: { isError: true, message: emailValidate.error?.message }
            }))
        }

        if (passwordValidate.error) {
            setErrors(prevState => ({
                ...prevState,
                password: { isError: true, message: passwordValidate.error?.message }
            }))
        }
    }

    return (
        <form className={classes.form} onSubmit={onSubmit}>
            <Container style={{textAlign: 'center'}}>
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
                    onChange={event => setEmail(event.target.value)}
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
                    label="New password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    onChange={event => setPassword(event.target.value)}
                    inputProps={{"data-testid": "password"}}
                    autoFocus
                    onBlur={onBlurHandler}
                    InputProps={{
                        className: classes.textinput,
                    }}
                    helperText={errors.password.message}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    style={{maxWidth: "85%"}}
                    id="verificationCode"
                    label="Verification Code"
                    name="verificationCode"
                    autoComplete=""
                    onChange={ event=>setVerificationCode(event.target.value) }
                    inputProps={{"data-testid": "verificationCode"}}
                    autoFocus
                    InputProps={{
                        className: classes.textinput,
                    }}
                />
            </Container>
            
            <Container className={classes.buttons} style={{maxWidth: "100%"}}>
                
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.next}
                >
                    Reset Password
                </Button>
                
            </Container>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={snackBarOpen.verifyInfo}
                autoHideDuration={3300}       
            >
                <Alert 
                    onClose={() => setSnackBarOpen((prevState) => ({
                        ...prevState,
                        verifyInfo: false
                    }))} 
                    severity="info" 
                    sx={{ width: '100%' }}
                >
                    Please enter your verification code that has been sent to your email.
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={snackBarOpen.verifyError}
                autoHideDuration={3300}       
            >
                <Alert 
                    onClose={() => setSnackBarOpen((prevState) => ({
                        ...prevState,
                        verifyError: false
                    }))} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    Invalid verification code.
                </Alert>
            </Snackbar>
            
        </form>
    )
}

export default ResetPasswordForm;