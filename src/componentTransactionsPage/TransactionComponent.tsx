import React from "react";

// Définissez un type pour les props
type TransactionProps = {
  id: number; // Remplacez "number" par le type approprié
  title: string;
  amount: string; // Remplacez "string" par le type approprié
  description: string;
};

function TransactionComponent({ id, title, amount, description }: TransactionProps) {
  return (
    <div>
        <span>Transaction component</span>
      <p>ID: {id}</p>
      <p>Title: {title}</p>
      <p>Amount: {amount}</p>
      <p>Description: {description}</p>
    </div>
  );
}

export default TransactionComponent;
