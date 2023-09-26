import React from "react";

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: string;
  balance: string;
  transType: string;
  category: string;
  note: string;
}

export const transactionsData = [
  {
    id: 1,
    date: "June 20th, 2020",
    description: "Golden Sun Bakery",
    amount: "$5.00",
    balance: "$2082.79",
    transType: "Electronic",
    category: "Food",
    note: "",
  },
  {
    id: 2,
    date: "June 20th, 2020",
    description: "Golden Sun Bakery",
    amount: "$10.00",
    balance: "$2087.79",
    transType: "Electronic",
    category: "Food",
    note: "",
  },
  {
    id: 3,
    date: "June 20th, 2020",
    description: "Golden Sun Bakery",
    amount: "$20.00",
    balance: "$2097.79",
    transType: "Electronic",
    category: "Food",
    note: "",
  },
  {
    id: 4,
    date: "June 20th, 2020",
    description: "Golden Sun Bakery",
    amount: "$40.00",
    balance: "$2147.79",
    transType: "Electronic",
    category: "Food",
    note: "",
  },

  {
    id: 5,
    date: "June 20th, 2020",
    description: "Golden Sun Bakery",
    amount: "$50.00",
    balance: "$2187.79",
    transType: "Electronic",
    category: "Food",
    note: "",
  },
];
