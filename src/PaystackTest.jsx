import React, { useState } from "react";

const API_BASE = "http://localhost:4000"; // change to your backend URL
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1YzcxNDRkLWZiMGItNGJkZC05NTcyLTViMGQwMGUzOWNiZiIsImlhdCI6MTc1NDgzOTM0NywiZXhwIjoxNzU1MDk4NTQ3fQ.hzFrFKTZNyxBbhIwr0q5-XZ38XqZ2zPY6UbFVzYE6Tc"; // replace with a real token from login

export default function PaystackTest() {
  const [initData, setInitData] = useState(null);
  const [verifyData, setVerifyData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInitialize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInitData(null);

    const email = e.target.email.value;
    const amount = Number(e.target.amount.value); // convert to kobo
    const planType = e.target.planType.value;
    const callback_url = e.target.callback_url.value;

    try {
      const res = await fetch(`${API_BASE}/api/payment/paystack/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ amount, planType, callback_url }),
      });

      const data = await res.json();
      setInitData(data);

      if (data.data?.authorization_url) {
        window.open(data.data.authorization_url, "_blank");
      }
    } catch (err) {
      setInitData({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerifyData(null);

    const reference = e.target.reference.value;

    try {
      const res = await fetch(`${API_BASE}/api/payment/paystack/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const data = await res.json();
      setVerifyData(data);
    } catch (err) {
      setVerifyData({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Paystack Test</h1>

      {/* Initialize Payment */}
      <h2>Initialize Payment</h2>
      <form onSubmit={handleInitialize}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="number" name="amount" placeholder="Amount (₦)" required />
        <input type="text" name="planType" placeholder="Plan Type" />
        <input
          type="text"
          name="callback_url"
          placeholder="Callback URL"
          defaultValue="http://localhost:3000/callback"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Initialize Payment"}
        </button>
      </form>
      {initData && (
        <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
          {JSON.stringify(initData, null, 2)}
        </pre>
      )}

      {/* Verify Payment */}
      <h2>Verify Payment</h2>
      <form onSubmit={handleVerify}>
        <input type="text" name="reference" placeholder="Transaction Reference" required />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Verify Payment"}
        </button>
      </form>
      {verifyData && (
        <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
          {JSON.stringify(verifyData, null, 2)}
        </pre>
      )}
    </div>
  );
}
