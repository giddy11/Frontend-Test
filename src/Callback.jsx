import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1YzcxNDRkLWZiMGItNGJkZC05NTcyLTViMGQwMGUzOWNiZiIsImlhdCI6MTc1NDgzOTM0NywiZXhwIjoxNzU1MDk4NTQ3fQ.hzFrFKTZNyxBbhIwr0q5-XZ38XqZ2zPY6UbFVzYE6Tc";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference");

    if (!reference) {
      console.log("No reference found");
      navigate("/payment-failed");
      return;
    }

    fetch(`http://localhost:4000/api/payment/paystack/verify/${reference}`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
})
  .then((res) => res.json())
  .then((data) => {
    setLoading(false);
    console.log("data res", data);
    console.log("data status res", data.status);
    if (data.status === true || data.data?.status === "success") {
      navigate("/payment-success");
    } else {
      navigate("/payment-failed");
    }
  })
  .catch(() => {
    setLoading(false);
    navigate("/payment-failed");
  });

  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>{loading ? "Verifying your payment..." : "Redirecting..."}</h1>
    </div>
  );
}
