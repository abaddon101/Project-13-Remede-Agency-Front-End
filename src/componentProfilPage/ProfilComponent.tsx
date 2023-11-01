import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../features/store/store";
import { fetchUserProfile } from "../features/reducers/authLoginSlice";
import axios from "axios";
import { Link } from "react-router-dom";

function ProfilComponent() {
  // Get the Redux dispatch function and some state variables using useSelector
  const dispatch = useDispatch<AppDispatch>() as any;
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [isEditButtonEnabled, setIsEditButtonEnabled] = useState(true);
  const firstName = useSelector((state: RootState) => state.auth.firstName);
  const lastName = useSelector((state: RootState) => state.auth.lastName);
  const token = useSelector((state: RootState) => state.auth.token);

  // Function to handle the "Edit" button click
  const handleEditClick = () => {
    console.log("Edit button clicked");
    setIsEditing(true);
    setIsEditButtonEnabled(false);
  };

  // Function to handle the "Cancel" button click
  const handleCancelClick = () => {
    // Reset the edited fields to the current values of firstName and lastName
    setEditedFirstName(firstName);
    setEditedLastName(lastName);

    // Disable the edit mode
    setIsEditing(false);
  };

  // Function to handle input changes in the edited first name and last name fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "editedFirstName") {
      setEditedFirstName(e.target.value);
    } else if (e.target.name === "editedLastName") {
      setEditedLastName(e.target.value);
    }
  };

  // Function to handle the form submission when saving the edited profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send a request to the Swagger API to update the name
    try {
      const updatedData = {
        firstName: editedFirstName,
        lastName: editedLastName,
      };

      // Send the update request with the authentication token
      const response = await axios.put(
        "http://localhost:3001/api/v1/user/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check the API response and update the name locally if the update is successful
      if (response.status === 200) {
        // Update the local profile data
        dispatch(fetchUserProfile(token)); // This should update firstName and lastName in the Redux store

        // Also, reset the values in the localStorage
        localStorage.setItem("firstName", editedFirstName);
        localStorage.setItem("lastName", editedLastName);

        // Disable the edit mode
        setIsEditing(false);

        // Add console.log statements for debugging
        console.log(
          "LocalStorage firstName:",
          localStorage.getItem("firstName")
        );
        console.log("LocalStorage lastName:", localStorage.getItem("lastName"));
      } else {
        // Handle update errors here
        console.error("Error updating profile:", response);
      }
    } catch (error) {
      // Handle exception errors here
      console.error("Error updating profile:", error);
    }
  };

  // Render the user profile interface
  return (
    <main className="main bg-dark">
      <div className="header">
        <div>
          <h1 className="profil-h1">Welcome back</h1>
          <h2
            className={
              !isEditing && isAuthenticated ? "active-name" : "inactive-name"
            }
          >
            {isAuthenticated ? `${firstName} ${lastName}` : "Loading..."}
          </h2>
        </div>
        {isEditing ? (
          <form className="form-editing-grid" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                name="editedFirstName"
                value={editedFirstName}
                onChange={handleInputChange}
                className="custom-input"
              />
              <input
                type="text"
                name="editedLastName"
                value={editedLastName}
                onChange={handleInputChange}
                className="custom-input"
              />
            </div>
            <div className="button-group">
              <button className="save-button" type="submit">
                Save
              </button>
              <button
                className="cancel-button"
                type="button"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <button
              className="edit-button"
              onClick={handleEditClick}
              disabled={isEditing}
            >
              Edit Name
            </button>
          </div>
        )}

        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Checking (x8349)</h3>
            <p className="account-amount">$2,082.79</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <Link to="/Transactions" className="transaction-button">
              View transactions
            </Link>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Savings (x6712)</h3>
            <p className="account-amount">$10,928.42</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <Link to="/Transactions" className="transaction-button">
              View transactions
            </Link>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
            <p className="account-amount">$184.30</p>
            <p className="account-amount-description">Current Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <Link to="/Transactions" className="transaction-button">
              View transactions
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfilComponent;
