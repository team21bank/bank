import React, { useContext, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Transaction, compareDates } from '../Interfaces/Transaction';
import { Button, Row } from "react-bootstrap";
import { AuthContext, BankContext } from "../Authentication/auth";

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


function EarningsChart() {
  const user = useContext(AuthContext).user;
  const bank = useContext(BankContext).bank;

  const earnings = bank.completedList[user.hash] ? (bank.completedList as Record<string, Transaction[]>)[user.hash].filter(t => t.receiver_uid === user.hash) : [];

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
    <div>
      <h3>Earnings</h3>
      <Pie data={earnData}/>
    </div>
  )
}

function SpendingChart() {
  const user = useContext(AuthContext).user;
  const bank = useContext(BankContext).bank;

  const losses = bank.completedList[user.hash] ? (bank.completedList as Record<string, Transaction[]>)[user.hash].filter(t => t.sender_uid === user.hash) : [];

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

  return (
    <div>
      <h3>Spending</h3>
      <Pie data={spendData}/>
    </div>
  )
}


export function PieCharts() {
  const [view_spending, set_view_spending] = useState(false);
  return (
    <div style={{paddingTop: "5vh"}}>
      {view_spending ? (
        <div>
          <SpendingChart/>
          <br/>
          <Button size="lg" onClick={()=>set_view_spending(false)}>View earnings instead</Button>
        </div>
      ) : (
        <div>
          <EarningsChart/>
          <br/>
          <Button size="lg" onClick={()=>set_view_spending(true)}>View spending instead</Button>
        </div>
      )}
    </div>
  )
}