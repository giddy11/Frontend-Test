import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1 style={{ color: "red" }}>❌ Payment Failed</h1>
      <p>Please try again or contact support.</p>
      <button
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          background: "red",
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
