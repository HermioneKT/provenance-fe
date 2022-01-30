import React from 'react'
import {Bar } from 'react-chartjs-2'


/**
 * IncomeChart component
 * This IncomeChart component implements
 * the UI for Data Visualization of Income Chart. This functional
 * component is used in the Dashboard as a
 * child component
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
const IncomeChart = () => {
  return (
    <div>
      <Bar
        data={{
          labels: ['1st-10th', '11th-20th', '21th-30th', '31th-40th', '41th-50th', '51th-60th', '61th-70th', '71th-80th', '81th-90th', '91th-100th'],
          datasets: [
            {
              label: 'Average monthly household income from work',
              data: [2045, 4121, 5893, 7788, 9829, 11700, 13965, 16821, 20413, 31289],
              backgroundColor: [
                'rgba(173, 216, 230, 0.5)',
                'rgba(135, 206, 235, 0.5)',
                'rgba(0, 191, 255, 0.5)',
                'rgba(100, 149, 237, 0.5)',
                'rgba(30, 114, 255, 0.5)',
                'rgba(65, 105, 225, 0.5)',
                'rgba(0, 0, 225, 0.5)',
                'rgba(0, 0, 205, 0.5)',
                'rgba(0, 0, 139, 0.5)',
                'rgba(25, 25, 112, 0.5)',
              ],
            },
          ],
        }}
        height={400}
        width={600}
      />
    </div>
  )
}

export default IncomeChart