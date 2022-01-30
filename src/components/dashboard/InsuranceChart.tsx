import React from 'react'
import {Doughnut} from 'react-chartjs-2'


/**
 * IncomeChart component
 * This IncomeChart component implements
 * the UI for Data Visualization of Income Chart.
 * This functional component is used in the 
 * Dashboard as a child component
 * @returns {JSX.Element}
 * 
 * @author Sokunthea
 */
const InsuranceChart = () => {
  return (
    <div>
      <Doughnut
        data={{
          labels: ['Endowment', 'Whole Life', 'Term', 'Health', 'Others'],
          datasets: [
            {
              label: 'Insurance Policies by Percentage',
              data: [16.6, 17, 19.8, 46.5, 0.1],
              backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(25, 25, 112, 1)',
              ],
              hoverOffset: 4,
            },
          ],
        }}
        height={1000}
        width={1000}
        options= {{
          maintainAspectRatio: true,
        }}  
        
      />
    </div>
  )
}

export default InsuranceChart