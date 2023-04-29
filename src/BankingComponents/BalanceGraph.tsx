import React, { useContext, useState } from 'react';
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
import { Container } from 'react-bootstrap';
import { AuthContext, BankContext } from '../Authentication/auth';

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
      }
    },
  }


/**
 * Displays a chart with balance history for that user. 
 *
 * @returns JSX visuals of the user's balance history over the period of the passed in transactions
 */
export function BalanceGraph(): JSX.Element {
  const user = useContext(AuthContext).user;
  const bank = useContext(BankContext).bank;
  const transactions = (bank.completedList as Record<string, Transaction[]>)[user.hash].sort((a, b) => compareDates(a, b));

  const balanceHistory: number[] = transactions.map(t => t.receiver_uid === user.hash ? t.receiver_balance : t.sender_balance || 0)
  const dataPoints = transactions.map((transaction: Transaction): string => {
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
  return (
    <Container fluid>
      <h3>Balance History:</h3>
      <Line options={options} data={newData} />
    </Container>
  );
}