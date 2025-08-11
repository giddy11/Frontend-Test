import React, { useState } from "react";
import SubscriptionPlans from "./SubscriptionPlan";
// import SubscriptionPlans from "./SubscriptionPlans";

export default function PaystackSubscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  // const handleInitializePayment = async () => {
  //   if (!selectedPlan) {
  //     alert("Please select a plan first.");
  //     return;
  //   }

  //   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1YzcxNDRkLWZiMGItNGJkZC05NTcyLTViMGQwMGUzOWNiZiIsImlhdCI6MTc1NDgzOTM0NywiZXhwIjoxNzU1MDk4NTQ3fQ.hzFrFKTZNyxBbhIwr0q5-XZ38XqZ2zPY6UbFVzYE6Tc"; // Replace with auth token
  //   const res = await fetch("http://localhost:4000/api/payment/paystack/initialize", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       // email: "user@example.com",
  //       name: selectedPlan.name,
  //       id: selectedPlan.id,
  //       currency: selectedPlan.currency,
  //       description: selectedPlan.description,
  //       limits: selectedPlan.limits,
  //       paidCommunity: selectedPlan.paidCommunity,
  //       eventsDetails: selectedPlan.eventsDetails,
  //       transactionFees: selectedPlan.transactionFees,
  //       pricing: selectedPlan.pricing,
  //       features: selectedPlan.features,
  //       amount: selectedPlan.price, // in Naira, backend converts to Kobo
  //       callback_url: "http://localhost:5173/callback",
  //     }),
  //   });

  //   const data = await res.json();
  //   if (data.data?.authorization_url) {
  //     window.open(data.data.authorization_url, "_blank");
  //   }
  // };

   const handleInitializePayment = async () => {
    if (!selectedPlan) {
      alert("Please select a plan first.");
      return;
    }

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1YzcxNDRkLWZiMGItNGJkZC05NTcyLTViMGQwMGUzOWNiZiIsImlhdCI6MTc1NDgzOTM0NywiZXhwIjoxNzU1MDk4NTQ3fQ.hzFrFKTZNyxBbhIwr0q5-XZ38XqZ2zPY6UbFVzYE6Tc"; // Replace with auth token
    const res = await fetch("http://localhost:4000/api/payment/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // email: "user@example.com",
        planType: selectedPlan.name, // Add planType, mapped to selectedPlan.name
        id: selectedPlan.id,
        currency: selectedPlan.currency,
        description: selectedPlan.description,
        limits: selectedPlan.limits,
        paidCommunity: selectedPlan.paidCommunity,
        eventsDetails: selectedPlan.eventsDetails,
        transactionFees: selectedPlan.transactionFees,
        pricing: selectedPlan.pricing,
        features: selectedPlan.features,
        amount: selectedPlan.price, // in Naira, backend converts to Kobo
        callback_url: "http://localhost:5173/callback",
      }),
    });

    const data = await res.json();
    if (data.data?.authorization_url) {
      window.open(data.data.authorization_url, "_blank");
    }
  };

  return (
    <div>
      <SubscriptionPlans onPlanSelect={setSelectedPlan} />
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          style={{
            background: "purple",
            color: "#fff",
            padding: "0.7rem 1.5rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleInitializePayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
