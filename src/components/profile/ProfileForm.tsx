import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { MenuItem, Snackbar, TextField, Grid, Paper, Typography, SnackbarContent } from '@material-ui/core';
import { JoiPassword } from "joi-password";
import APIService from 'utils/ApiService';
import cognitoService from 'utils/CognitoService';
import placeholders from './placeholders.json';


interface IError {
  isError: boolean
  message: string | undefined
}

interface IErrors {
  no_of_children: IError
  yearly_income: IError
  current_saving: IError
  current_debt: IError
  oa_saving: IError
  special_saving: IError
  house_type: IError
  house_valuation: IError
  no_of_room: IError
  currentPassword: IError
  newPassword: IError
  cfmNewPassword: IError
}

const noError: IError = {
  isError: false,
  message: ""
}


const useStyles = makeStyles((theme) => ({
  paperGrid: {
    marginTop: '36px',
  },
  paper: {
    width: '100%',
    padding: '1.3% 3% 1.8% 3.6%',
    borderRadius: '10px',
  },
  paperHeader: {
    fontWeight: 'bold',
    marginTop: '12px',
    marginBottom: '16px',
    textAlign: 'left',
    alignItems: 'center',
  },
  detailGrid: {
    padding: '0 2.5% 0 2.5%',
    marginBottom: '14px',
  },
  detailName: {
    textAlign: 'left',
    alignItems: 'center',
    wordWrap: 'break-word',
  },
  detailNameText: {
    fontWeight: 'bold',
    fontSize: '0.86rem',
  },
  detailValueText: {
    marginLeft: '14px',
    fontSize: 'small',
  },
  detailField: {
    paddingLeft: '6px',
    margin: 'auto',
    textAlign: 'left',
    alignItems: 'center',
    wordWrap: 'break-word',
  },
  fieldMenu: {
    fontSize: 'small',
  },
  fieldMain: {
    borderRadius: '8px',
    height: '24px',
  },
  fieldInput: {
    fontSize: 'small',
  },
  fieldRoot: {
    '&:hover $notchedOutline': {
      borderColor: '#d0d0d0 !important',
    },
    '&$cssFocused $notchedOutline': {
      borderColor: '#d0d0d0 !important',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
    },
  },
  cssFocused: {
    // do not remove this class!!! yes it is supposed to be empty
  },
  notchedOutline: {
    borderColor: 'white !important',
  },
  securityFieldMain: {
    borderRadius: '8px',
    height: '30px',
    marginBottom: '3px',
  },
  securityNotchedOutline: {
    borderColor: '#c2c2c2 !important'
  },
  buttonGrid: {
    margin: '36px 0 56px 0',
  },
  saveButton: {
    width: '13%',
    margin: '0 51px 0 auto',
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
 * Profile Component
 * Implements the User Profile ui.
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const ProfileForm = () => {

  const classes = useStyles();

  React.useEffect(() => {
    // call getProfile API & cognito for user profile data
    const loadUserProfileData = async () => {
      const APIData = await APIService.getProfile();
      const cognitoData = await cognitoService.getUserProfile();
      
      if (APIData && cognitoData) {
        const cognitoDataCleaned = { ...cognitoData.UserAttributes.reduce((a: any, { Name, Value }: any) => ({...a, [Name]: Value}), {})};
        const { sub, email_verified, ...cognitoUserData } = cognitoDataCleaned;
        const { recommendation_id, ...APIUserData } = APIData.body;

        setDetails(prevState => ({
          ...prevState,
          ...cognitoUserData,
          ...APIUserData
        }));
      }
    }
    loadUserProfileData();
  }, []);

  const [ details, setDetails ] = React.useState<{ [key: string]: any }>({...placeholders});
  const [ error, setError ] = React.useState<IErrors>({
    no_of_children: noError,
    yearly_income: noError,
    current_saving: noError,
    current_debt: noError,
    oa_saving: noError,
    special_saving: noError,
    house_type: noError,
    house_valuation: noError,
    no_of_room: noError,
    currentPassword: noError,
    newPassword: noError,
    cfmNewPassword: noError
  });
  const [ disabled, setDisabled ] = React.useState<boolean>(false);
  const [ snackbar, setSnackbar ] = React.useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: "" });

  const updateDetail = async (event: React.ChangeEvent<any>) => {
    // update textfield value
    setDetails({
      ...details,
      [event.target.id]: event.target.value
    });
  }

  const validateInput = async (event: React.ChangeEvent<any>) => {

    let errorMessage: string = "";

    if (['currentPassword', 'newPassword', 'cfmNewPassword'].includes(event.target.id)) {
      const passwordValidate = JoiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces().validate(details[event.target.id], {
          messages: {
              'string.pattern.base': 'Invalid password format. Password should contain at least 8 characters'
          }
      });
      if (!(event.target.value === "") && passwordValidate.error) {
        errorMessage = passwordValidate.error.message;
      }
    } else if (event.target.value === "") {
      errorMessage = "Answer is required!";
    }
    else {
      if (isNaN(event.target.value)) {
        errorMessage = "Value must be a number!";
      } else if (+event.target.value < 0) {
        errorMessage = "Value cannot be negative!";
      } else if (['no_of_children', 'no_of_room'].includes(event.target.id)
                    && !Number.isInteger(+event.target.value)) {
        errorMessage = "Value must be an integer!";
      }
    }

    if (errorMessage === "") {
      // no error
      if (event.target.id === "house_valuation" || event.target.id === "no_of_room") {
        setError(prevState => ({
          ...prevState,
          house_type: noError,
          house_valuation: noError,
          no_of_room: noError
        }));

        // if no errors in any other field, enable button
        setDisabled(false);
        Object.entries(error).forEach((entry) => {
          if (entry[0] !== "house_type" && entry[0] !== "house_valuation" && entry[0] !== "no_of_room" && entry[1].isError) {
            setDisabled(true);
          }
        });

      } else {
        setError(prevState => ({
          ...prevState,
          [event.target.id]: noError
        }));

        if (['newPassword', 'cfmNewPassword'].includes(event.target.id)) {
          setError(prevState => ({
            ...prevState,
            newPassword: noError,
            cfmNewPassword: noError,
          }));
        }

        // if no errors in any field, enable button
        setDisabled(false);
        Object.entries(error).forEach((entry) => {
          if (entry[0] !== event.target.id && entry[1].isError) {
            setDisabled(true);
          }
        });
      }
    } else {
      // there is an error
      setError(prevState => ({
        ...prevState,
        [event.target.id]: {
          isError: true,
          message: errorMessage
        }
      }));
      setDisabled(true);
    }
  }

  const onSave = async (event: React.FormEvent) => {
    // housing details validation - error in the case where some field is empty/zero if some other field is not empty/zero
    if (!(details.house_type === "" && details.house_valuation === "0" && details.no_of_room === "0")
        && (details.house_type === "" || details.house_valuation === "0" || details.no_of_room === "0")) {
      if (details.house_type === "") {
        setError(prevState => ({
          ...prevState,
          house_type: {
            isError: true,
            message: "This field pertaining to housing cannot be N.A. if any of the other 2 are non-zero! Leave all fields at N.A. or 0 if you do not have a house."
          }
        }));
        setDisabled(true);
      } if (details.house_valuation === "0") {
        setError(prevState => ({
          ...prevState,
          house_valuation: {
            isError: true,
            message: "This field pertaining to housing cannot be 0 if any of the other 2 are not! Leave all fields at N.A. or 0 if you do not have a house."
          }
        }));
        setDisabled(true);
      } if (details.no_of_room === "0") {
        setError(prevState => ({
          ...prevState,
          no_of_room: {
            isError: true,
            message: "This field pertaining to housing cannot be 0 if any of the other 2 are not! Leave all fields at N.A. or 0 if you do not have a house."
          }
        }));
        setDisabled(true);
      }
      return;
    }

    // new password & confirm new password validation - must be the same
    if (details.newPassword !== details.cfmNewPassword) {
      const pwNoMatch = {
        isError: true,
        message: "New passwords do not match."
      };
      setError(prevState => ({
        ...prevState,
        newPassword: pwNoMatch,
        cfmNewPassword: pwNoMatch
      }));
      setDisabled(true);
      return;
    }

    // prepare data for sending
    event.preventDefault();
    const { given_name, family_name, birthdate, email, currentPassword, newPassword, cfmNewPassword, ...remainingDetails } = details;
    var snackbarMessage: string = "";

    if (details.currentPassword !== "" || details.newPassword !== "") {
      // passwords validation - error in the case where some field is empty/zero if some other field is not empty/zero
      if (details.currentPassword === "") {
        setError(prevState => ({
          ...prevState,
          currentPassword: {
            isError: true,
            message: "Please enter your current password if you wish to change it, or leave all password fields empty."
          }
        }));
        setDisabled(true);
        return;
      } else if (details.newPassword === "") {
        setError(prevState => ({
          ...prevState,
          newPassword: {
            isError: true,
            message: "Please enter a new password if you wish to change it, or leave all password fields empty."
          }
        }));
        setDisabled(true);
        return;
      }

      // send passwords to cognito for updating
      const response = await cognitoService.changePassword(currentPassword, newPassword);
      if (response === {}) {
        snackbarMessage = "Profile updated successfully!";
      } else if (response.message) {
        snackbarMessage = response.message;
        if (String(response.name) === "NotAuthorizedException") {
          snackbarMessage = "Incorrect password. Please try again.";
        }
        setSnackbar({ isOpen: true, message: snackbarMessage });
        return;
      }
    }

    // clear password fields
    setDetails(prevState => ({
      ...prevState,
      currentPassword: "",
      newPassword: "",
      cfmNewPassword: "",
    }));
    
    // send API to edit profile
    const m = await APIService.editProfile(remainingDetails);
    if (m && m.body === "Updated successfully.") {
      snackbarMessage = "Profile updated successfully!";
    } else {
      snackbarMessage = "Profile could not be updated. Please try again or contact the administrator.";
    }
    setSnackbar({ isOpen: true, message: snackbarMessage });
  }

  return (
    <div className="root">
    <form id="editProfileForm" style={{ position: 'relative'}}>
      <Grid container spacing={0} className={classes.paperGrid}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" className={classes.paperHeader}>
            Profile
          </Typography>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                First Name
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <Typography component="h1" variant="body1" className={classes.detailValueText}>
                {details['given_name']}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Last Name
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <Typography component="h1" variant="body1" className={classes.detailValueText}>
                {details['family_name']}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Date of Birth
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <Typography component="h1" variant="body1" className={classes.detailValueText}>
                {details['birthdate']}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Email
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <Typography component="h1" variant="body1" className={classes.detailValueText}>
                {details['email']}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container spacing={0} className={classes.paperGrid}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" className={classes.paperHeader}>
            Security
          </Typography>
          <Grid container className={classes.detailGrid}>
            <Typography component="h1" variant="body1" className={classes.detailNameText}>
              Change Your Password
            </Typography>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              type="password"
              id="currentPassword"
              placeholder="Password"
              value={details['currentPassword']}
              onChange={updateDetail}
              onBlur={validateInput}
              error={error.currentPassword.isError}
              helperText={error.currentPassword.isError ? error.currentPassword.message : ""}
              InputProps={{
                  className: classes.securityFieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.securityNotchedOutline,
                  }
              }}
            />
          </Grid>
          <Grid container className={classes.detailGrid}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              type="password"
              id="newPassword"
              placeholder="New Password"
              value={details['newPassword']}
              onChange={updateDetail}
              onBlur={validateInput}
              error={error.newPassword.isError}
              helperText={error.newPassword.isError ? error.newPassword.message : ""}
              InputProps={{
                  className: classes.securityFieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.securityNotchedOutline,
                  }
              }}
            />
          </Grid>
          <Grid container className={classes.detailGrid}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              type="password"
              id="cfmNewPassword"
              placeholder="Confirm New Password"
              value={details['cfmNewPassword']}
              onChange={updateDetail}
              onBlur={validateInput}
              error={error.cfmNewPassword.isError}
              helperText={error.cfmNewPassword.isError ? error.cfmNewPassword.message : ""}
              InputProps={{
                  className: classes.securityFieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.securityNotchedOutline,
                  }
              }}
            />
          </Grid>
        </Paper>
      </Grid>

      <Grid container spacing={0} className={classes.paperGrid}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" className={classes.paperHeader}>
            Family
          </Typography>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Spouse
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="have_spouse"
                select
                SelectProps={{
                  value: details['have_spouse'],
                  onChange: (event) => setDetails(prevState => ({
                    ...prevState,
                    have_spouse: event.target.value
                  })),
                }}
                InputProps={{
                  className: classes.fieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              >
                <MenuItem className={classes.fieldMenu} value="true">Yes</MenuItem>
                <MenuItem className={classes.fieldMenu} value="false">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Number of Children
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="no_of_children"
                value={details['no_of_children']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.no_of_children.isError}
                helperText={error.no_of_children.isError ? error.no_of_children.message : ""}
                InputProps={{
                  className: classes.fieldMain,
                  classes: {
                    input: classes.fieldInput,
                    root: classes.fieldRoot,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container spacing={0} className={classes.paperGrid}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" className={classes.paperHeader}>
            Financial Details
          </Typography>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Yearly Income
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="yearly_income"
                value={details['yearly_income']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.yearly_income.isError}
                helperText={error.yearly_income.isError ? error.yearly_income.message : ""}
                InputProps={{
                    className: classes.fieldMain,
                    classes: {
                      input: classes.fieldInput,
                      root: classes.fieldRoot,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Current Savings
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="current_saving"
                value={details['current_saving']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.current_saving.isError}
                helperText={error.current_saving.isError ? error.current_saving.message : ""}
                InputProps={{
                    className: classes.fieldMain,
                    classes: {
                      input: classes.fieldInput,
                      root: classes.fieldRoot,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Current Debt
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="current_debt"
                value={details['current_debt']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.current_debt.isError}
                helperText={error.current_debt.isError ? error.current_debt.message : ""}
                InputProps={{
                    className: classes.fieldMain,
                    classes: {
                      input: classes.fieldInput,
                      root: classes.fieldRoot,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                CPF Ordinary Account Savings
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="oa_saving"
                value={details['oa_saving']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.oa_saving.isError}
                helperText={error.oa_saving.isError ? error.oa_saving.message : ""}
                InputProps={{
                    className: classes.fieldMain,
                    classes: {
                      input: classes.fieldInput,
                      root: classes.fieldRoot,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                CPF Special Account Savings
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="special_saving"
                value={details['special_saving']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.special_saving.isError}
                helperText={error.special_saving.isError ? error.special_saving.message : ""}
                InputProps={{
                    className: classes.fieldMain,
                    classes: {
                      input: classes.fieldInput,
                      root: classes.fieldRoot,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container spacing={0} className={classes.paperGrid}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" className={classes.paperHeader}>
            Housing Details
          </Typography>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                House Type
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="house_type"
                error={error.house_type.isError}
                helperText={error.house_type.isError ? error.house_type.message : ""}
                select
                SelectProps={{
                  value: details['house_type'],
                  onChange: (event) => {
                    setDetails(prevState => ({
                      ...prevState,
                      house_type: event.target.value
                    }));
                    setError(prevState => ({
                      ...prevState,
                      house_type: noError,
                      house_valuation: noError,
                      no_of_room: noError
                    }));
                    setDisabled(false);
                  },
                }}
                InputProps={{
                  className: classes.fieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              >
                <MenuItem className={classes.fieldMenu} value="">N.A.</MenuItem>
                <MenuItem className={classes.fieldMenu} value="HDB">HDB Flat</MenuItem>
                <MenuItem className={classes.fieldMenu} value="Condo">Condominium</MenuItem>
                <MenuItem className={classes.fieldMenu} value="Landed">Landed Property</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                House Valuation
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="house_valuation"
                value={details['house_valuation']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.house_valuation.isError}
                helperText={error.house_valuation.isError ? error.house_valuation.message : ""}
                InputProps={{
                    className: classes.fieldMain,
                    classes: {
                      input: classes.fieldInput,
                      root: classes.fieldRoot,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Number of Rooms
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="no_of_room"
                value={details['no_of_room']}
                onChange={updateDetail}
                onBlur={validateInput}
                error={error.no_of_room.isError}
                helperText={error.no_of_room.isError ? error.no_of_room.message : ""}
                InputProps={{
                    className: classes.fieldMain,
                    classes: {
                      input: classes.fieldInput,
                      root: classes.fieldRoot,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container spacing={0} className={classes.paperGrid}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" className={classes.paperHeader}>
            Insurance Plans
          </Typography>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Life Insurance
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="have_life_insurance"
                select
                SelectProps={{
                  value: details['have_life_insurance'],
                  onChange: (event) => setDetails(prevState => ({
                    ...prevState,
                    have_life_insurance: event.target.value
                  })),
                }}
                InputProps={{
                  className: classes.fieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              >
                <MenuItem className={classes.fieldMenu} value="true">Yes</MenuItem>
                <MenuItem className={classes.fieldMenu} value="false">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Disability Insurance
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="have_disability_insurance"
                select
                SelectProps={{
                  value: details['have_disability_insurance'],
                  onChange: (event) => setDetails(prevState => ({
                    ...prevState,
                    have_disability_insurance: event.target.value
                  })),
                }}
                InputProps={{
                  className: classes.fieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              >
                <MenuItem className={classes.fieldMenu} value="true">Yes</MenuItem>
                <MenuItem className={classes.fieldMenu} value="false">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Hospitalisation Insurance
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="have_hospitalisation_insurance"
                select
                SelectProps={{
                  value: details['have_hospitalisation_insurance'],
                  onChange: (event) => setDetails(prevState => ({
                    ...prevState,
                    have_hospitalisation_insurance: event.target.value
                  })),
                }}
                InputProps={{
                  className: classes.fieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              >
                <MenuItem className={classes.fieldMenu} value="true">Yes</MenuItem>
                <MenuItem className={classes.fieldMenu} value="false">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container className={classes.detailGrid}>
            <Grid item xs={4} className={classes.detailName}>
              <Typography component="h1" variant="body1" className={classes.detailNameText}>
                Critical Illness Insurance
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.detailField}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                id="have_critical_illness_insurance"
                select
                SelectProps={{
                  value: details['have_critical_illness_insurance'],
                  onChange: (event) => setDetails(prevState => ({
                    ...prevState,
                    have_critical_illness_insurance: event.target.value
                  })),
                }}
                InputProps={{
                  className: classes.fieldMain,
                  classes: {
                    input: classes.fieldInput,
                    notchedOutline: classes.notchedOutline,
                  }
                }}
              >
                <MenuItem className={classes.fieldMenu} value="true">Yes</MenuItem>
                <MenuItem className={classes.fieldMenu} value="false">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid container spacing={3} className={classes.buttonGrid}>
        <Button
          onClick={onSave}
          disabled={disabled}
          className={classes.saveButton}
        >
          Save
        </Button>
        <Snackbar
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
          }}
          style={{
            marginTop: '80px'
          }}
          open={snackbar.isOpen}
          autoHideDuration={3300}
          onClose={()=>{setSnackbar({ isOpen: false, message: "" })}}          
        >
          <SnackbarContent
            style={{
              backgroundColor: '#553D67',
            }}
            message={<Typography component="h1" variant="body1">{snackbar.message}</Typography>}
          />
        </Snackbar>
      </Grid>
    </form>
    </div>
  )
}

export default ProfileForm;