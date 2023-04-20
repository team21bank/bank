import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Transaction, compareDates } from '../Interfaces/Transaction';
import { Button } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);


const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [0.1, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

/**
 * A function that'll return an array with the total spending towards each category
 * @param transactions the transactions you're interested in finding the spending per category of
 * @returns An array with the spending per category (ordered in the same way that getCategories is)
 */
export function getSpendingPerCategory(transactions: Transaction[]): number[] {
    const categories = getCategories(transactions);
    const totalPerCategory: number[] = [];
    categories.forEach((category: String) => {
        const categoryTransactions = transactions.filter((transaction: Transaction): boolean => {
            return transaction.type === category;
        });
        const categoryTotal: number = categoryTransactions.reduce(
            (total: number, transaction: Transaction) => (total += transaction.transfer_amount), 0
        );
        totalPerCategory.push(categoryTotal);
    });
    return totalPerCategory;
}

/**
 * Function that pulls the transaction categories out of a list of transactions
 * @param transactions The list of transactions you want to know the categories of
 * @returns A list of strings representing the unique types present in the list
 */
export function getCategories(transactions: Transaction[]): string[] {
    const categoryList = transactions.map((transaction: Transaction): string => {
        return transaction.type || "misc";
    });
    return Array.from(new Set(categoryList));
}

export function EarningChart(transactionsAndUID: {transactions: Transaction[], uid: string}): JSX.Element {
    //State variables to handle hiding/showing the 2 individual pie charts.
    const [showSpending, setShowSpending] = useState<boolean>(true);
    //Sorts the passed in transactions
    transactionsAndUID.transactions.sort((a, b) => compareDates(a, b)).map((transaction: Transaction): number => {
    return transaction.receiver_uid === transactionsAndUID.uid ? transaction.receiver_balance : transaction.sender_balance || 0;
  })
  //Gets the transactions where the given user gained money 
  const earnings = transactionsAndUID.transactions.filter((transaction: Transaction): boolean => {
      return transaction.receiver_uid === transactionsAndUID.uid;
  });
  //Gets the transactions where the given user lost money
  const losses = transactionsAndUID.transactions.filter((transaction: Transaction) => {
      return transaction.receiver_uid !== transactionsAndUID.uid;
  });

  const spendData = {
    labels: getCategories(losses),
    datasets: [
      {
        label: "Amount of Money spent on",
        data: getSpendingPerCategory(losses),
        backgroundColor: [
          "rgba(255, 0, 0, 0.8)",
          "rgba(255, 112, 0, 0.8)",
          "rgba(255, 201, 0, 0.8)",
          "rgba(205, 192, 192, 0.8)",
          "rgba(183, 102, 0, 0.8)",
          "rgba(255, 64, 159, 0.8)"
        ],
        borderColor: [
          "rgba(235, 0, 0, 1)",
          "rgba(235, 92, 0, 1)",
          "rgba(235, 171, 0, 1)",
          "rgba(175, 162, 162, 1)",
          "rgba(183, 72, 0, 1)",
          "rgba(225, 34, 129, 1)"
        ],
        borderWidth: 2
      }
    ]
  };

  const earnData = {
    labels: getCategories(earnings),
    datasets: [
      {
        label: "Amount of Money earned from",
        data: getSpendingPerCategory(earnings),
        backgroundColor: [
          "rgba(0, 255, 0, 0.8)",
          "rgba(0, 200, 120, 0.8)",
          "rgba(0, 250, 200, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(0, 159, 64, 0.8)"
        ],
        borderColor: [
          "rgba(0, 225, 0, 1)",
          "rgba(0, 170, 90, 1)",
          "rgba(0, 220, 170, 1)",
          "rgba(45, 162, 162, 1)",
          "rgba(123, 72, 225, 1)",
          "rgba(0, 129, 34, 1)"
        ],
        borderWidth: 2
      }
    ]
  };
  return (
    <div style={{width: "auto", justifySelf: "center", margin: "1px"}}>
        <h2>Pie Charts</h2>
        {showSpending && 
            <div>
                <h4>Spending</h4>
                <div style={{width: "auto", marginLeft: "auto", display: "inline-flex"}}>
                    <Pie data={spendData}/>
                </div>
            </div>}
        {!showSpending && 
            <p>
                <h4>Earnings</h4>
                <div style={{width: "auto", marginLeft: "auto", display: "inline-flex"}}> 
                    <Pie data={earnData}/>
                </div>
            </p>}
        <Button style={{marginRight: "2px"}} onClick={() => setShowSpending(!showSpending)}>
            Swap to {showSpending ? "Earnings " : "Spending "} Chart
        </Button>
    </div>
  )
}
/*
export function BalanceGraph({transactions}: {transactions: Transaction[]}): JSX.Element {
  return <Line options={options} data={data} />;
}
*/