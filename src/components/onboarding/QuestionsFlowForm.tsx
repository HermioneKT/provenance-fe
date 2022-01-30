/* eslint-disable no-useless-escape */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { MenuItem, TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import questions from './questions.json';
import routes from 'constants/routes';
import { useHistory } from 'react-router-dom';
import MiscService from 'utils/MiscService';
let keys = Object.keys(questions);
type QnKey = keyof typeof questions;


const housingQns = [ "house_valuation", "no_of_room", "house_type" ]    // in reverse order

const useStyles = makeStyles((theme) => ({
    form: {
        width: '97%',
    },
    questiongrid: {
        paddingLeft: '6%',
        paddingRight: '5%',
        marginBottom: '2%',
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
 * QuestionsFlowForm component
 * This QuestionsFlowForm component implements
 * the UI for the form that prompts information from 
 * users who are going to sign up. 
 * This functional component is used in the 
 * QuestionsFlowPage as a child component
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const QuestionsFlowForm = () => {

    const classes = useStyles();

    const [ key, setKey ] = React.useState<string>(keys[0]);
    const [ answers, setAnswers ] = React.useState<{ [key: string]: any }>({});
    const [ input, setInput ] = React.useState<String>("");
    const [ error, setError ] = React.useState<[boolean, string]>([false, ""]);

    const [ showField, setShowField ] = React.useState<boolean[]>([true, false, false]);

    React.useEffect(() => {
        setAnswers(MiscService.getOnboardingData());
    }, [])

    const history = useHistory();
    const onBack = async (event: React.FormEvent) => {
        if (keys.indexOf(key) > 0) {
            // store user input for this question
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [key]: input
            }));

            // load the previous question
            setKey(keys[keys.indexOf(key)-1]);

            // show the relevant input field type
            if (['yearly_income', 'current_saving', 'oa_saving', 'special_saving',
                  'current_debt', 'no_of_children', 'no_of_room', 'house_valuation']
                    .includes(keys[keys.indexOf(key)-1])) {
                setShowField([true, false, false]);
            } else if (['have_spouse', 'have_house', 'have_life_insurance', 'have_disability_insurance',
                  'have_hospitalisation_insurance', 'have_critical_illness_insurance']
                    .includes(keys[keys.indexOf(key)-1])) {
                setShowField([false, true, false]);
            } else if (keys[keys.indexOf(key)-1] === "house_type") {
                setShowField([false, false, true]);
            }

            // autofill with user's previous answer to the question (or empty if none)
            setInput(answers[keys[keys.indexOf(key)-1]] ? answers[keys[keys.indexOf(key)-1]] : "");

            // focus on input field and clear error
            document.getElementById("answer")?.focus()
            setError([false, ""]);
        } else {
            // user pressed BACK on first qn, so return to TnC
            redirectTOC();
        }
    }

    const onNext = async (event: React.FormEvent) => {
        // if user clicks NEXT on last question
        if (keys.indexOf(key) >= keys.length - 1) {
            // proceed to sign up page
            redirectSignUp();
            
            // updates for no house
            if (answers.have_house === "false") {
                setAnswers(prevAnswers => ({
                    ...prevAnswers,
                    "house_type": "",
                    "no_of_room": "0",
                    "house_valuation": "0",
                }));
            }
        }

        // store user input for this question
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [key]: input
        }));

        // housing question
        if (key === "have_house") {
            // have house and indicated no house before
            if (input === "true" && keys[keys.indexOf(key)+1] !== "house_type") {
                // add the following questions about housing back
                housingQns.forEach(qn => {
                    keys.splice(keys.indexOf(key)+1, 0, qn);
                });                
            }
            // no house and have not indicated no house before
            else if (input === "false" && keys[keys.indexOf(key)+1] === "house_type") {
                // don't ask the following questions about housing
                keys.splice(keys.indexOf(key)+1, 3);
            }
        }

        // load the next question
        setKey(keys[keys.indexOf(key)+1]);

        // show the relevant input field type
        if (['yearly_income', 'current_saving', 'oa_saving', 'special_saving',
              'current_debt', 'no_of_children', 'no_of_room', 'house_valuation']
                .includes(keys[keys.indexOf(key)+1])) {
            setShowField([true, false, false]);
        } else if (['have_spouse', 'have_house', 'have_life_insurance', 'have_disability_insurance',
              'have_hospitalisation_insurance', 'have_critical_illness_insurance']
                .includes(keys[keys.indexOf(key)+1])) {
            setShowField([false, true, false]);
        } else if (keys[keys.indexOf(key)+1] === "house_type") {
            setShowField([false, false, true]);
        }

        // clear input or autofill with user's previous answer to the question
        setInput(answers[keys[keys.indexOf(key)+1]] ? answers[keys[keys.indexOf(key)+1]] : "");
        
        // focus on input field and clear error
        document.getElementById("answer")?.focus()
        setError([false, ""]);
    }

    const updateAnswer = async (event: { target: { value: any } }) => {
        // update input field
        setInput(event.target.value);

        // clear error
        setError([false, ""]);
    }

    const validateAnswer = async (event: { target: { value: any } }) => {
        setError([false, ""]);

        if (event.target.value === "") {
            setError([true, "Answer is required!"]);
        }
        else if (keys[keys.indexOf(key)] === "email") {
            const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
            if (!validEmailRegex.test(event.target.value)) {
                setError([true, "Not a valid email."]);
            }
        }
        else if (['yearly_income', 'current_saving', 'oa_saving', 'special_saving',
                    'current_debt', 'no_of_children', 'no_of_room', 'house_valuation']
                        .includes(keys[keys.indexOf(key)])) {
            if (isNaN(event.target.value)) {
                setError([true, "Value must be a number!"]);
            } else if (+event.target.value < 0) {
                setError([true, "Value cannot be negative!"]);
            } else if (['no_of_children', 'no_of_room'].includes(keys[keys.indexOf(key)])
                            && !Number.isInteger(+event.target.value)) {
                setError([true, "Value must be an integer!"]);
            }
        }
    }

    const redirectSignUp = () => {
        const getCachedOnboardingData = MiscService.getOnboardingData()
        const onboardingData = {
            ...getCachedOnboardingData,
            ...answers
        }
        MiscService.setOnboardingData(onboardingData)
        history.push(routes.SIGNUP);
    }

    const redirectTOC = () => {
        MiscService.setOnboardingData(answers)
        history.push(routes.TOC)
    }


    return (
        <form className={classes.form} id="formm">
            <Grid item spacing={0} className={classes.questiongrid}>
              <Typography component="h1" variant="h4" style={{fontSize: '1.4rem'}}>
                {questions[key as QnKey]}
              </Typography>
            </Grid>
            <Container style={{textAlign: 'center'}}>
                { showField[0] ?     // show text field for text questions
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    style={{maxWidth: "80%"}}
                    label="Your Answer"
                    id="answer"
                    onChange={updateAnswer}
                    value={input}
                    onBlur={validateAnswer}
                    error={error[0]}
                    helperText={error[0] ? error[1] : ""}
                    autoFocus
                    InputProps={{
                        className: classes.textinput,
                    }}
                /> : null }
                { showField[1] ?     // show MCQ yes/no field for true/false questions
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    style={{maxWidth: "50%"}}
                    label="Your Answer"
                    id="answer"
                    error={error[0]}
                    helperText={error[0] ? error[1] : ""}
                    autoFocus
                    select
                    SelectProps={{
                        value: input,
                        onChange: updateAnswer,
                        onBlur: validateAnswer
                    }}
                >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                </TextField> : null }
                { showField[2] ?       // show MCQ for house_type question
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    style={{maxWidth: "50%"}}
                    label="Your Answer"
                    id="answer"
                    error={error[0]}
                    helperText={error[0] ? error[1] : ""}
                    autoFocus
                    select
                    SelectProps={{
                        value: input,
                        onChange: updateAnswer,
                        onBlur: validateAnswer
                    }}
                >
                    <MenuItem value="HDB">HDB Flat</MenuItem>
                    <MenuItem value="Condo">Condominium</MenuItem>
                    <MenuItem value="Landed">Landed Property</MenuItem>
                </TextField> : null }
                
            </Container>
            <Container className={classes.buttons}>
                <Button
                    disableTouchRipple
                    onClick={onBack}
                    className={classes.back}
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={error[0]}
                    className={classes.next}
                >
                    Next
                </Button>
            </Container>
        </form>
    )
}

export default QuestionsFlowForm;