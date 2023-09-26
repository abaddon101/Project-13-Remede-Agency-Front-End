import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../features/store/store";
import { fetchUserProfile } from "../features/reducers/authLoginSlice";
import axios from "axios";
import { Link } from "react-router-dom";

function ProfilComponent() {
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

  const handleEditClick = () => {
    console.log("Edit button clicked");
    setIsEditing(true);
    setIsEditButtonEnabled(false);
  };
  const handleCancelClick = () => {
    // Réinitialiser les champs édités aux valeurs actuelles de firstName et lastName
    setEditedFirstName(firstName);
    setEditedLastName(lastName);

    // Désactiver le mode d'édition
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "editedFirstName") {
      setEditedFirstName(e.target.value);
    } else if (e.target.name === "editedLastName") {
      setEditedLastName(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Envoyer une requête à l'API Swagger pour mettre à jour le nom
    try {
      const updatedData = {
        firstName: editedFirstName,
        lastName: editedLastName,
      };

      // Envoyer la requête de mise à jour avec le token d'authentification
      const response = await axios.put(
        "http://localhost:3001/api/v1/user/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Vérifier la réponse de l'API et mettre à jour le nom localement si la modification réussit
      if (response.status === 200) {
        // Mise à jour locale des données du profil
        dispatch(fetchUserProfile(token)); // Cela devrait mettre à jour firstName et lastName dans le Redux store

        // Réinitialisez également les valeurs dans le localStorage
        localStorage.setItem("firstName", editedFirstName);
        localStorage.setItem("lastName", editedLastName);

        // Désactiver le mode d'édition
        setIsEditing(false);
        // Ajoutez des déclarations console.log pour le débogage
        console.log(
          "LocalStorage firstName:",
          localStorage.getItem("firstName")
        );
        console.log("LocalStorage lastName:", localStorage.getItem("lastName"));
      } else {
        // Gérer les erreurs de modification ici
        console.error("Error updating profile:", response);
      }
    } catch (error) {
      // Gérer les erreurs d'exception ici
      console.error("Error updating profile:", error);
    }
  };

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
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
            <p className="account-amount">$184.30</p>
            <p className="account-amount-description">Current Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfilComponent;
