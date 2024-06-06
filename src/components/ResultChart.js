import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// export const data = {
//   labels: ['Yellow', 'Blue', 'Red',  'Green'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3, 5],
//       backgroundColor: [
//         'rgba(255, 251, 143, 0.2)',
//         'rgba(115, 200, 206, 0.2)',
//         'rgba(255, 148, 148, 0.2)',
//         'rgba(162, 229, 148, 0.2)',

//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

export function ResultChart({colorResult}) {
  console.log('---ResultChart--')
  const data = {
    labels: [],
  datasets: [
    {
      label: '# of Votes',
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 251, 143, 0.2)',
        'rgba(115, 200, 206, 0.2)',
        'rgba(255, 148, 148, 0.2)',
        'rgba(162, 229, 148, 0.2)',

      ],
      borderColor: [
        'rgba(255, 251, 143, 1)',
        'rgba(115, 200, 206, 1)',
        'rgba(255, 148, 148, 1)',
        'rgba(162, 229, 148, 1)',
      ],
      borderWidth: 1,
    },
  ],
  }
  const [result, setResult] = useState(null);
  const chartRef =useRef();
  

  const resulting =() =>{
    console.log('calc RESULT')
    console.log(data.datasets[0].data)
    chartRef.current.update()
    
  }

  useEffect(()=> {
    setResult(colorResult);
    console.log("==setResult==")
  },[resulting]);

  // const result = colorResult;
  console.log(colorResult)

  if(result != null){
  data.datasets[0].data[0] = result.color1;
  data.datasets[0].data[1] = result.color2;
  data.datasets[0].data[2] = result.color3;
  data.datasets[0].data[3] = result.color4;
  chartRef.current.update()
  }



  return (
    <div>
  <Pie ref={chartRef} data={data} className=' z-30 '/>
    </div>
);
}