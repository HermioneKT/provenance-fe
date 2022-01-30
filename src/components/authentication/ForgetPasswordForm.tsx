import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import cognitoService from 'utils/CognitoService';
import Container from '@material-ui/core/Container';
import Joi from 'joi';
import { useHistory } from 'react-router-dom';
import routes from 'constants/routes';
import Snackbar from '@material-ui/core/Snackbar';
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
    textinput: {
        borderRadius: '11px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
    },
    buttons: {
        textAlign: 'right',
        paddingRight: '8%',
    },
    next: {
        width: '13%',
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
}));

/**
 * ForgetPasswordForm component
 * This ForgetPasswordForm component implements
 * the UI for Forget Password. This functional
 * component is used in the ForgetPasswordPage as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai
 */
const ForgetPasswordForm = () => {

    const classes = useStyles();
    const history = useHistory();

    const [ email, setEmail ] = React.useState<string>('');
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
        const isForgetPassword = await cognitoService.forgetPassword(email);
        if (isForgetPassword) {
            history.push(routes.RESET_PASSWORD);
        } else {
            setSnackBarOpen(true)
        }
    }

    const onBlurHandler = async (event: React.FormEvent) => {
        setButtonDisabled(false)
        setErrors({
            email: { isError: false, message: '' }
        });
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
            setButtonDisabled(true)
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
                    onChange={ event => setEmail(event.target.value) }
                    inputProps={{"data-testid": "email"}}
                    autoFocus
                    InputProps={{
                        className: classes.textinput,
                    }}
                    onBlur={onBlurHandler}
                    helperText={errors.email.message}
                />
            </Container>
            
            <Container className={classes.buttons} style={{maxWidth: "85%"}}>
                
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.next}
                    disabled={buttonDisabled}
                >
                    Send
                </Button>
                
            </Container>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={snackBarOpen}
                autoHideDuration={3300}       
            >
                <Alert onClose={() => setSnackBarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    Reset Password Fail. 
                </Alert>
            </Snackbar>
        </form>
    )
}

export default ForgetPasswordForm;