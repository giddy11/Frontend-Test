import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1 style={{ color: "green" }}>✅ Payment Successful!</h1>
      <p>Thank you for your subscription.</p>
      <button
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
}
