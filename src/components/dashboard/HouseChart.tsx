// import React, {useState, useCallback} from 'react';
import {Bar } from 'react-chartjs-2'
// import axios from 'axios';
// import cognitoService from 'utils/CognitoService';
// import { config } from 'dotenv';

// config()
// const coreApiBaseUrl = process.env.API_BASE_URL

// const authAxios = axios.create({
//     baseURL: process.env.API_BASE_URL,
//     headers: {
//         Authorization: `Bearer ${cognitoService.getAccessToken()}`
//     }
// }) 


/**
 * HouseChart component
 * This HouseChart component implements
 * the UI for Data Visualization of House Chart. This functional
 * component is used in the Dashboard as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
const HouseChart = () => {
//   const [users, setUsers] = useState([]);
//   const [requestError, setRequestError] = useState();

//   const fetchData = useCallback(async()=> {
//     try{
//       const result = await authAxios.get(`https://0n2lxgk1qi.execute-api.ap-southeast-1.amazonaws.com/prod/generateLandingPageData`); //apiUrl
//       setUsers(result.data);
//     } catch(err) {
//         setRequestError(err.message);
//     }
//   });
  return (
    <div>
      {/* {fetchData} */}
      <Bar
        data={{
          labels: ['1st-20th', '21th-40th', '41th-60th', '61th-80th', '81th-100th'],
          datasets: [
            {
              label: 'HDB Dwellings 1- & 2-Room Flats ',
              data: [1220, 2464, 4093, 6183, 8004],
              backgroundColor: 'rgba(191, 63, 63, 1)',
              borderWidth: 1,
            },
            {
              label: 'HDB Dwellings 3-Room Flats ',
              data: [1700, 4225, 6175, 8245, 12185],
              backgroundColor: 'rgba(243, 135, 27, 1)',
              borderWidth: 1,
            },
            {
              label: 'HDB Dwellings 4-Room Flats ',
              data: [2697, 5583, 8245, 11279, 16669],
              backgroundColor: 'rgba(176, 231, 39, 1)',
              borderWidth: 1,
            },
            {
              label: 'HDB Dwellings 5-Room Flats & Executive Flats',
              data: [2601, 6475, 9532, 13484, 19391],
              backgroundColor: 'rgba(51, 207, 219, 1)',
              borderWidth: 1,
            },
            {
              label: 'Condominiums & Other Apartments ',
              data: [1372, 5375, 9498, 14544, 28923],
              backgroundColor: 'rgba(51, 129, 219, 1)',
              borderWidth: 1,
            },
            {
              label: 'Landed Properties',
              data: [1506, 6225, 11215, 16355, 40007],
              backgroundColor: 'rgba(79, 51, 219, 1)',
              borderWidth: 1,
            },
          ],
        }}
        height={400}
        width={600}
      />
    </div>
  )
}

export default HouseChart;