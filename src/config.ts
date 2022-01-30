import { config } from 'dotenv';
import { __String } from 'typescript';

config()

interface EnvConfig {
    cognitoUserPoolId: string
    cognitoClientId: string
    baseAPIUrl: string
    getProfileAPIKey: string
    getDataLandingAPIKey: string
    editProfileAPIKey: string
    generateHousingRecommendationAPIKey: string
    createInterestAPIKey: string
    generateInsuranceRecommendationAPIKey: string
}

const envConfig: EnvConfig = {
    cognitoUserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
    cognitoClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || '',
    baseAPIUrl: process.env.REACT_APP_BASE_API_URL || '',
    getProfileAPIKey: process.env.REACT_APP_GET_PROFILE_API_KEY || '',
    getDataLandingAPIKey: process.env.REACT_APP_GET_DATA_LANDING_API_KEY  || '',
    editProfileAPIKey: process.env.REACT_APP_EDIT_PROFILE_API_KEY  || '',
    generateHousingRecommendationAPIKey: process.env.REACT_APP_GENERATE_HOUSING_RECOMMENDATION_API_KEY || '',
    createInterestAPIKey: process.env.REACT_APP_CREATE_INTEREST_API_KEY || '',
    generateInsuranceRecommendationAPIKey: process.env.REACT_APP_GENERATE_INSURANCE_RECOMMENDATION_API_KEY || '',
}

export default envConfig;