import React, { useState } from "react";
import { Collapse, Button, Form } from "react-bootstrap";
import { transactionsData } from "./MockedTransactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

function Account() {
  // Initialize state for transactions and their collapse states
  const [transactions, setTransactions] = useState(transactionsData);
  const [transactionStates, setTransactionStates] = useState(
    transactionsData.map(() => false)
  );

  // Add local state to track whether the edit mode is enabled or disabled for each transaction
  const [editModes, setEditModes] = useState(transactionsData.map(() => false));

  // Function to toggle the collapse state of a transaction
  const handleToggleCollapse = (transactionId: any) => {
    const updatedTransactionStates = [...transactionStates];
    updatedTransactionStates[transactionId - 1] = !transactionStates[transactionId - 1];
    setTransactionStates(updatedTransactionStates);
  };

  // Function to save edits and disable edit mode
  const handleSaveEdit = (transactionId: any) => {
    // Disable the edit mode
    const updatedEditModes = [...editModes];
    updatedEditModes[transactionId - 1] = false;
    setEditModes(updatedEditModes);
  };

  // Function to handle input changes for a transaction
  const handleInputChange = (transactionId: any, field: any, value: any) => {
    const updatedTransactions = transactions.map((transaction, index) => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          [field]: value,
        };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
  };

  // Function to prevent form click from triggering collapse
  const handleFormClick = (e: any) => {
    e.stopPropagation();
  };

  // Event handler function to enable/disable edit mode
  const handleEditClick = (transactionId: any) => {
    const updatedEditModes = [...editModes];
    updatedEditModes[transactionId - 1] = !editModes[transactionId - 1];
    setEditModes(updatedEditModes);
  };

  return (
    <main className="main bg-dark">
      <div className="header">
        <div className="account-content-wrapper-transaction-page">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
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
                    <p className="vertical-section-child">
                      Transaction Type: {transaction.transType}
                    </p>
                    <Form.Group
                      className={`vertical-section-child ${
                        editModes[transaction.id - 1] ? "editable" : "inactive"
                      }`}
                    >
                      <Form.Label>
                        Category: {/* Add the pencil icon and event handler */}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={transaction.category}
                        readOnly={!editModes[transaction.id - 1]}
                        onChange={(e) =>
                          handleInputChange(
                            transaction.id,
                            "category",
                            e.target.value
                          )
                        }
                      />
                      <FontAwesomeIcon
                        width={20}
                        icon={faPen}
                        onClick={() => handleEditClick(transaction.id)}
                      />
                    </Form.Group>

                    <Form.Group
                      className={`vertical-section-child ${
                        editModes[transaction.id - 1] ? "editable" : "inactive"
                      }`}
                    >
                      <Form.Label>
                        Notes: {/* Add the pencil icon and event handler */}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={transaction.note}
                        readOnly={!editModes[transaction.id - 1]}
                        onChange={(e) =>
                          handleInputChange(
                            transaction.id,
                            "note",
                            e.target.value
                          )
                        }
                      />
                      <FontAwesomeIcon
                        width={20}
                        icon={faPen}
                        onClick={() => handleEditClick(transaction.id)}
                      />
                    </Form.Group>

                    {/* Display the "Save" button only when edit mode is active */}
                    {editModes[transaction.id - 1] && (
                      <Button className="save-button" onClick={() => handleSaveEdit(transaction.id)}>
                        Enregistrer
                      </Button>
                    )}
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
