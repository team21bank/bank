import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Transaction, compareDates } from '../Interfaces/Transaction';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Balance History',
      },
    },
  };
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [20, 40, 60, 80, 100, 120, 60, 20],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [10, 20, 30, 40, 50, 60, 70],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};


export function BalanceGraph(transactionsAndUID: {transactions: Transaction[], uid: string}): JSX.Element {
  const balanceHistory = transactionsAndUID.transactions.sort((a, b) => compareDates(a, b)).map((transaction: Transaction): number => {
    return transaction.receiver_uid === transactionsAndUID.uid ? transaction.receiver_balance : transaction.sender_balance || 0;
  })
  const dataPoints = transactionsAndUID.transactions.map((transaction: Transaction): string => {
    return transaction.date.toString().slice(0, 25);
  })
  const dataCopy = JSON.parse(JSON.stringify(data));
  const newData = {
    labels: dataPoints,
    datasets: [
      {
        label: 'Total Balance', 
        data: balanceHistory,
        borderColor: 'rgb(170, 200, 17)',
        backGroundColor: 'rgba(170, 200, 17, 0.5)'
    }
  ]
};
  return <Line options={options} data={newData} />;
}
/*
export function BalanceGraph({transactions}: {transactions: Transaction[]}): JSX.Element {
  return <Line options={options} data={data} />;
}
*/