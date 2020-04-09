import React, { PureComponent } from 'react';
import {
  BarChart, Bar, /*Cell,*/ XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  {
    name: '中文 A', aa: 4000, bb: 2400, amt: 2400,
  },
  {
    name: '中文 B', aa: 3000, bb: 1398, amt: 2210,
  },
  {
    name: '中文 C', aa: 2000, bb: 9800, amt: 2290,
  },
  {
    name: '中文 D', aa: 2780, bb: 3908, amt: 2000,
  },
  {
    name: '中文 E', aa: 1890, bb: 4800, amt: 2181,
  },
  {
    name: '中文 F', aa: 2390, bb: 3800, amt: 2500,
  },
  {
    name: '中文 G', aa: 3490, bb: 4300, amt: 2100,
  },
];

export default class Rechart extends PureComponent {
  //static jsfiddleUrl = 'https://jsfiddle.net/alidingling/90v76x08/';

  render() {
    return (
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="aa" stackId="a" fill="#8884d8" />
        <Bar dataKey="bb" stackId="b" fill="#82ca9d" />
        <Bar dataKey="amt" stackId="c" fill="#000000" />
      </BarChart>
    );
  }
}
