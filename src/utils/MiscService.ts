import { OnboardingData } from "./MiscTypings";


/**
 * Class that contains misc methods
 * @author Lim Yan Kai, Lim Her Huey, Sokunthea
 */
class MiscService {
    /**
     * Helper method to set onboarding data
     * @param onboardingData 
     */
    public static setOnboardingData(onboardingData: any): void {
        sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    }
    /**
     * Helper method to get onboarding data
     * @returns {OnboardingData | {}}
     */
    public static getOnboardingData(): OnboardingData | {} {
        const getJson = sessionStorage.getItem('onboardingData') || '';
        if (getJson === '') {
            return {}
        }
        console.log(JSON.parse(getJson));
        return JSON.parse(getJson);
    }
    /**
     * Helper method to delete onboarding data
     */
    public static deleteOnboardingData() {
        sessionStorage.removeItem('onboardingData');
    }
}


export default MiscService;