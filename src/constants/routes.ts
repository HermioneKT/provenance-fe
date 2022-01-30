interface Routes {
    HOME: string
    LOGIN: string
    SIGNUP: string
    LOGOUT: string
    FORGET_PASSWORD: string
    RESET_PASSWORD: string
    TOC: string
    ONBOARD: string
    NOT_FOUND: string
    PROFILE: string
    DATALANDING: string
    HOUSINGRECOMMENDATION: string
    INSURANCERECOMMENDATION: string
    DESCRIPTION: string
}

const routes: Routes = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    LOGOUT: '/logout',
    FORGET_PASSWORD: '/forget-password',
    RESET_PASSWORD: '/reset-password',
    TOC: '/getstarted',
    ONBOARD: '/onboarding',
    NOT_FOUND: '/404',
    PROFILE: '/profile',
    DATALANDING: '/mydata',
    HOUSINGRECOMMENDATION: '/housingrecommendation',
    INSURANCERECOMMENDATION: '/insurancerecommendation',
    DESCRIPTION: '/description',
}

export default routes