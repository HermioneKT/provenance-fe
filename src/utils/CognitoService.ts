import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import envConfig from 'config';
import { COGNITO_ATTRIBUTES } from 'constants/cognito';
import SESSION_STORAGE_KEY from 'constants/sessionstorage';
import { CognitoSignUp } from './CognitoServiceTypings';
import MiscService from './MiscService';
import AWS from 'aws-sdk'

/**
 * This class provides for easy usage of 
 * Cognito's SDK.
 * 
 * @author Yan Kai, Her Huey
 */
class CognitoService {

    private userPoolId: string | undefined
    private clientId: string | undefined
    private userPool: CognitoUserPool

    constructor() {
        this.userPoolId = envConfig.cognitoUserPoolId;
        this.clientId = envConfig.cognitoClientId;

        this.userPool = new CognitoUserPool({
            UserPoolId: this.userPoolId,
            ClientId: this.clientId
        });
    }

    /**
     * Sign up user. 
     * 
     * After using the signUp method successfully, 
     * the user status will be 'UNCONFIRMED' and
     * will be sent an email to verify
     * his/her user account and return true
     * 
     * If unsuccessful, return false.
     * @param signUpData 
     * @returns {Promise<boolean>}
     */
    public signUp(signUpData: CognitoSignUp): Promise<Boolean> {

        const attributeGivenName = new CognitoUserAttribute({
            Name: COGNITO_ATTRIBUTES.GIVEN_NAME,
            Value: signUpData.givenName
        })

        const attributeFamilyName = new CognitoUserAttribute({
            Name: COGNITO_ATTRIBUTES.FAMILY_NAME,
            Value: signUpData.familyName
        })

        const attributeEmail = new CognitoUserAttribute({
            Name: COGNITO_ATTRIBUTES.EMAIL,
            Value: signUpData.email
        })

        const attributeBirthdate = new CognitoUserAttribute({
            Name: COGNITO_ATTRIBUTES.BIRTHDATE,
            Value: signUpData.birthdate
        })

        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                signUpData.email, 
                signUpData.password, 
                [
                    attributeGivenName, 
                    attributeFamilyName, 
                    attributeEmail, 
                    attributeBirthdate
                ],
                [],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                },
            )
        })
    }
    /**
     * Verify User
     * 
     * Method to confirm user's registration, used together
     * with signUp method.
     * Upon confirmation of correct verification code,
     * User's status will change from 'Unconfirmed' to 'Confirmed'
     * @param email 
     * @param verificationCode 
     * @returns {Promise<Boolean>}
     */
    public verifyUser(email: string, verificationCode: string): Promise<Boolean> {

        const user = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        const metaData: any = MiscService.getOnboardingData()

        if (Object.keys(metaData).length !== 0) {
            return new Promise((resolve, reject) => {
                user.confirmRegistration(verificationCode, true, (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else {
                        MiscService.deleteOnboardingData()
                        resolve(true);
                    }
                },
                {
                    "oa_saving": metaData.oa_saving.toString(),
                    "yearly_income": metaData.yearly_income.toString(),
                    "current_saving": metaData.current_saving.toString(),
                    "house_valuation": metaData.house_valuation.toString(),
                    "current_debt": metaData.current_debt.toString(),
                    "have_spouse": metaData.have_spouse.toString(),
                    "special_saving": metaData.special_saving.toString(),
                    "no_of_children": metaData.no_of_children.toString(),
                    "house_type": metaData.house_type.toString(),
                    "no_of_room": metaData.no_of_room.toString(),
                    "have_life_insurance": metaData.have_life_insurance.toString(),
                    "have_disability_insurance": metaData.have_disability_insurance.toString(),
                    "have_hospitalisation_insurance": metaData.have_hospitalisation_insurance.toString(),
                    "have_critical_illness_insurance": metaData.have_critical_illness_insurance.toString()
                }
                )
            })
        }

        return new Promise((resolve, reject) => resolve(false))
    } 
    /**
     * Login User
     * 
     * Method to login user. Sends a request to Cognito and if 
     * successful, stores tokens returned by Cognito SDK
     * to session and return true. Else returns false. 
     * @param email 
     * @param password 
     * @returns {Promise<Boolean>}
     */
    public logIn(email: string, password: string): Promise<Boolean> {
    
        const user = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        return new Promise((resolve, reject) => {
            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    this.clientSideLogin(data, email);
                    resolve(true);
                },
                onFailure: (data) => {
                    console.log(data)
                    resolve(false);
                }
            })
        })

    }

    /**
     * Client Side Login
     * 
     * Method to store tokens to
     * session.
     * @param data 
     * @param email 
     */
    public clientSideLogin(data: CognitoUserSession, email: string): void {
        sessionStorage.setItem(SESSION_STORAGE_KEY.ACCESS_TOKEN, data.getAccessToken().getJwtToken());
        sessionStorage.setItem(SESSION_STORAGE_KEY.ID_TOKEN, data.getIdToken().getJwtToken());
        sessionStorage.setItem(SESSION_STORAGE_KEY.REFRESH_TOKEN, data.getRefreshToken().getToken());
        sessionStorage.setItem(SESSION_STORAGE_KEY.EMAIL, email)
    }
    /**
     * Logout User
     * 
     * Method to invalidate tokens in Cognito
     * and remove token from session.
     */
    public logOut(): void {
        const currentUser = this.userPool.getCurrentUser();
        currentUser?.signOut(this.clientSideLogout);
    }
    /**
     * Client Side Logout
     * 
     * Method used to remove obselete tokens from 
     * session
     */
    public clientSideLogout(): void {
        sessionStorage.removeItem(SESSION_STORAGE_KEY.ACCESS_TOKEN);
        sessionStorage.removeItem(SESSION_STORAGE_KEY.ID_TOKEN);
        sessionStorage.removeItem(SESSION_STORAGE_KEY.REFRESH_TOKEN);
        sessionStorage.removeItem(SESSION_STORAGE_KEY.EMAIL)
    }

    public forgetPassword(email: string) {
        const user = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });
        return new Promise((resolve, reject) => {
            user.forgotPassword({
                onSuccess: (data) => {
                    console.log("onSuccess", data)
                    resolve(true);
                },
                onFailure: (data) => {
                    console.error("onFailure:", data)
                    resolve(false)
                }
            })
        })
    }
    /**
     * Confirm Password
     * 
     * Method to confirm password to be changed
     * @param email 
     * @param password 
     * @param verificationCode 
     * @returns 
     */
    public confirmPassword(email: string, password: string, verificationCode: string) {
        const user = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });
        return new Promise((resolve, reject) => {
            user.confirmPassword(verificationCode, password, {
                onSuccess: (data) => {
                    console.log('Password confirmed');
                    resolve(true)
                },
                onFailure: (data) => {
                    console.log(data)
                    console.log('Password not confirmed');
                    resolve(false)
                }
            })
        })
    }
    /**
     * Get access Token
     * 
     * Method to get access token in session. Returns
     * an empty string if access token is not found.
     * @returns {string}
     */
    public getAccessToken(): string {
        const accessToken = sessionStorage.getItem(SESSION_STORAGE_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            return "";
        }
        return accessToken;
    }
    /**
     * Get email
     * 
     * Method to get email in session. Returns
     * an empty string if email is not found.
     * @returns {string}
     */
    public getEmail(): string {
        const email = sessionStorage.getItem(SESSION_STORAGE_KEY.EMAIL);
        if (!email) {
            return ""
        }
        return email
    }

    /**
     * Change password for authenticated (logged in) user
     * 
     * Method to change user password using
     * Cognito SDK method.
     * @returns {Promise<AWS.CognitoIdentityServiceProvider.ChangePasswordResponse>}
     */
    public changePassword(curPassword: string, newPassword: string): Promise<any> {
        const accessToken = this.getAccessToken();
        const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider();
        const params = {
            AccessToken: accessToken,
            PreviousPassword: curPassword,
            ProposedPassword: newPassword,
        };

        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.changePassword(params, function(err: any, data: any) {
                if (err) {
                    resolve(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Get user profile
     * 
     * Method to fetch user profile information using
     * Cognito SDK method.
     * @returns {Promise<AWS.CognitoIdentityServiceProvider.GetUserResponse>}
     */
    public getUserProfile(): Promise<AWS.CognitoIdentityServiceProvider.GetUserResponse> {
        const accessToken = this.getAccessToken();
        AWS.config.region = 'ap-southeast-1';
        const cognitoidentityserviceprovider = this.getCognitoIdentityServiceProvider();
        const params = {
            AccessToken: accessToken
        };        
        
        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.getUser(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Helper method to fetch user profile information using
     * Cognito SDK method.
     * @returns {Promise<AWS.CognitoIdentityServiceProvider.GetUserResponse>}
     */
    public getCognitoIdentityServiceProvider(): AWS.CognitoIdentityServiceProvider {
        AWS.config.region = 'ap-southeast-1';
        return new AWS.CognitoIdentityServiceProvider();
    }

}

const cognitoService = new CognitoService();

export default cognitoService;