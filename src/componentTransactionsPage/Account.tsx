import React from "react";
import { accountData } from "./componentTransactionsMocked";

function Account() {
  console.log("Account");
  return <section className="transaction">
  {accountData.map((account, index) => (
    <Account
      key={index}
    //   id={account.id}
    //   title={account.title}
    //   amount={account.amount}
    //   description={account.description}
    />
  ))}
</section>;
}

export default Account;
