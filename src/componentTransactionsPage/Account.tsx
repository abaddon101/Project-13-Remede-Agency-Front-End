import React, { useState } from "react";
import { Collapse, Button, Form } from "react-bootstrap";
import { transactionsData } from "./MockedTransactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

function Account() {
  const [transactions, setTransactions] = useState(transactionsData);
  const [transactionStates, setTransactionStates] = useState(
    transactionsData.map(() => false)
  );

  const handleToggleCollapse = (transactionId: any) => {
    // Mettez à jour l'état du Collapse pour la transaction spécifique
    const updatedTransactionStates = [...transactionStates];
    updatedTransactionStates[transactionId - 1] =
      !transactionStates[transactionId - 1]; // Inversez l'état

    setTransactionStates(updatedTransactionStates);
  };

  const handleSaveEdit = (transactionId: any) => {
    // Mettez à jour l'état du Collapse pour la transaction spécifique
    const updatedTransactionStates = [...transactionStates];
    updatedTransactionStates[transactionId - 1] = false; // Supposons que les IDs commencent à partir de 1

    setTransactionStates(updatedTransactionStates);
  };

  const handleInputChange = (transactionId: any, field: any, value: any) => {
    // Mettez à jour uniquement la transaction spécifique
    const updatedTransactions = transactions.map((transaction, index) => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          [field]: value,
        };
      }
      return transaction;
    });

    // Mettez à jour vos transactions ici
    setTransactions(updatedTransactions);
  };

  const handleFormClick = (e: any) => {
    // Empêchez la propagation de l'événement de clic depuis les champs de formulaire
    e.stopPropagation();
  };

  return (
    <main className="main bg-dark">
      <div className="header">
        <h5 className="horizontal-legend">
          <p className="horizontal-legend-child">DATE</p>
          <p className="horizontal-legend-child">DESCRIPTION</p>
          <p className="horizontal-legend-child">AMOUNT</p>
          <p className="horizontal-legend-child">BALANCE</p>
        </h5>
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            <Collapse
              className="collapse-transaction"
              in={transactionStates[transaction.id - 1]}
            >
              <div onClick={() => handleToggleCollapse(transaction.id)}>
                <div className="horizontal-section">
                  <p className="horizontal-section-child">
                    <FontAwesomeIcon
                      width={45}
                      icon={
                        transactionStates[transaction.id - 1]
                          ? faAngleUp
                          : faAngleDown
                      }
                    />
                    {transaction.date}
                  </p>
                  <p className="horizontal-section-child">
                    {transaction.description}
                  </p>
                  <p className="horizontal-section-child">
                    {transaction.amount}
                  </p>
                  <p className="horizontal-section-child">
                    {transaction.balance}
                  </p>
                </div>

                {transactionStates[transaction.id - 1] && (
                  <div className="vertical-section" onClick={handleFormClick}>
                    <Form.Group className="vertical-section-child">
                      <Form.Label>Transaction Type:</Form.Label>
                      <Form.Control
                        type="text"
                        value={transaction.transType}
                        onChange={(e) =>
                          handleInputChange(
                            transaction.id,
                            "transType",
                            e.target.value
                          )
                        }
                      />
                    </Form.Group>
                    <Form.Group className="vertical-section-child">
                      <Form.Label>Category:</Form.Label>
                      <Form.Control
                        type="text"
                        value={transaction.category}
                        onChange={(e) =>
                          handleInputChange(
                            transaction.id,
                            "category",
                            e.target.value
                          )
                        }
                      />
                    </Form.Group>
                    <Form.Group className="vertical-section-child">
                      <Form.Label>Notes:</Form.Label>
                      <Form.Control
                        type="text"
                        value={transaction.note}
                        onChange={(e) =>
                          handleInputChange(
                            transaction.id,
                            "note",
                            e.target.value
                          )
                        }
                      />
                    </Form.Group>
                    <Button onClick={() => handleSaveEdit(transaction.id)}>
                      Enregistrer
                    </Button>
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Account;
