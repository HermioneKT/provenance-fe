import axios from 'axios';
import envConfig from 'config';
import cognitoService from './CognitoService';
import {createBrowserHistory} from 'history';
import routes from 'constants/routes';


export const coreApi = axios.create({
  baseURL: envConfig.baseAPIUrl,
});

/**
 * This class provides for easy usage of 
 * API Service.
 * 
 * @author Yan Kai, Her Huey, Sokunthea
 */
export class APIService {

  /**
   * Helper method to set default headers
   * @param xApiKey 
   * @param accessToken 
   */
  public static setHeaders (xApiKey: string, accessToken: string) {
    coreApi.defaults.headers = {
      "content-type": "application/json",
      "x-api-key": xApiKey,
      "Authorization": accessToken,
    }
  }    
  /**
   * Get API specific user profile information
   * from API
   * @returns 
   */
  public static async getProfile(): Promise<any> {        
    try {
      const xApiKey = envConfig.getProfileAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const response = await coreApi.post("/prod/getProfile", {
        "Authorization": accessToken,
      })
      return response.data
    } catch (err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }
  /**
   * Update user profile information via
   * POST to API
   * @param profileData 
   * @returns 
   */
  public static async editProfile(profileData: { [key: string]: any }): Promise<any> {        
    try {
      const xApiKey = envConfig.getProfileAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const data = {
        ...profileData,
        Authorization: accessToken,
      }
      const response = await coreApi.post("/prod/editProfile", data)
      return response.data
    } catch (err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }
  /**
   * Get Data Landing page information from API
   * @returns 
   */
  public static async getDashboard(): Promise<any> {
    try{
      const xApiKey = envConfig.getDataLandingAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const response = await coreApi.post("/prod/generateLandingPageData", {
        "Authorization": accessToken,
      });
      return response.data;
    } catch(err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }

  public static async generateHousingRecommendationNoFilter(): Promise<any>   {
    try{
      const xApiKey = envConfig.generateHousingRecommendationAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const response = await coreApi.post("/prod/generateHousingRecommendation", {
        "Authorization": accessToken,
        "page": 1,
      });
      return response.data;
    } catch(err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }

  public static async generateHousingRecommendationFilter( 
    page: number,
    minAmt: number, 
    maxAmt: number, 
    minBedroom: number,
    maxBedroom: number,
    minBathroom: number,
    maxBathroom: number,
    minSize: number,
    maxSize: number,
    ): Promise<any>   {
    try{
      const xApiKey = envConfig.generateHousingRecommendationAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const response = await coreApi.post("/prod/generateHousingRecommendation", {
        "Authorization": accessToken,
        "page": page,
        "min_amount": minAmt,
        "max_amount": maxAmt,
        "min_bedroom": minBedroom,
        "max_bedroom": maxBedroom,
        "min_bathroom": minBathroom,
        "max_bathroom": maxBathroom,
        "min_sqfeet": minSize,
        "max_sqfeet": maxSize,
        "type": "All"
      });
      return response.data;
    } catch(err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }

  public static async generateInsuranceRecommendationFilter(
    page: number,
    type: string,
  ): Promise<any>   {
    try{
      const xApiKey = envConfig.generateInsuranceRecommendationAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const response = await coreApi.post("/prod/generateInsuranceRecommendation", {
        "Authorization": accessToken,
        "page": page,
        "type": type,
      });
      return response.data;
    } catch(err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }

  public static async generateInsuranceRecommendationNoFilter(): Promise<any>   {
    try{
      const xApiKey = envConfig.generateInsuranceRecommendationAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const response = await coreApi.post("/prod/generateInsuranceRecommendation", {
        "Authorization": accessToken,
        "page": 1,
      });
      return response.data;
    } catch(err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }
  /**
   * Create user interest in the house/insurance item
   * through posting to API
   * @param type
   * @param id
   * @returns 
   */
   public static async createInterest(type: string, id: string): Promise<any> {        
    try {
      const xApiKey = envConfig.createInterestAPIKey;
      const accessToken = cognitoService.getAccessToken();
      APIService.setHeaders(xApiKey, accessToken)
      const response = await coreApi.post("/prod/createInterest", {
        "Authorization": accessToken,
        "type": type,
        "id": id,
      })
      return response.data
    } catch (err:any) {
      if (err.response) {
        console.log(err.response);
        if (err.response.status >= 500 || err.response.status === 400) {
          console.log(err.response.statusText);
        } else if (err.response.status >= 401) {
          createBrowserHistory().push(routes.LOGIN);
        } else {
          console.log('unknown error pls fix');
          console.error(err);
        }
      }
    }
  }
}
    
export default APIService;