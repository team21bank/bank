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

//Registers the ChartJS elements, consistent with the library's demos.
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
/**
 * Options used by chartjs to configure the line graph
 */
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
  }


/**
 * Given a BankUser's uid as well as transactions they were involved with, displays a chart with balance history for that user. 
 * @param transactionsAndUID @property {Transaction[]} transactions, @property {string} uid
 * @returns JSX visuals of the user's balance history over the period of the passed in transactions
 */
export function BalanceGraph(transactionsAndUID: {transactions: Transaction[], uid: string}): JSX.Element {
  const balanceHistory = transactionsAndUID.transactions.sort((a, b) => compareDates(a, b)).map((transaction: Transaction): number => {
    return transaction.receiver_uid === transactionsAndUID.uid ? transaction.receiver_balance : transaction.sender_balance || 0;
  })
  const dataPoints = transactionsAndUID.transactions.map((transaction: Transaction): string => {
    return new Date(Date.parse(transaction.date)).toLocaleString();
  })
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