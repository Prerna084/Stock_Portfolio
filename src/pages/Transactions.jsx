import React from "react";

const transactions = [
  { date: "14 Oct 2025", stock: "TCS", type: "Buy", qty: 10, price: 3200, amount: 32000 },
  { date: "12 Oct 2025", stock: "INFY", type: "Sell", qty: 5, price: 1400, amount: 7000 },
  { date: "10 Oct 2025", stock: "RELIANCE", type: "Buy", qty: 8, price: 2300, amount: 18400 },
  { date: "07 Oct 2025", stock: "HDFC Bank", type: "Buy", qty: 6, price: 1550, amount: 9300 },
];

import { formatUSDToINRSync } from "../services/currency";

const Transactions = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Transactions</h1>

      <div className="card overflow-x-auto">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Stock</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i}>
                <td>{tx.date}</td>
                <td>{tx.stock}</td>
                <td
                  className={`font-medium ${
                    tx.type === "Buy" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tx.type}
                </td>
                <td>{tx.qty}</td>
                <td>{formatUSDToINRSync(tx.price) || `$${tx.price}`}</td>
                <td>{formatUSDToINRSync(tx.amount) || `$${tx.amount}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
