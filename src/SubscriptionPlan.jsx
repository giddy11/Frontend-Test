import React, { useEffect, useState } from "react";

/*
  SubscriptionPlans.jsx
  - Pure CSS (injected) — no Tailwind needed
  - Horizontal 3-column layout on desktop, stacks on mobile
  - Monthly / Yearly toggle + Region selector
  - Full plan details in modal
  - "Choose Plan" button now calls proceedToPayment and includes auth token/email from localStorage
*/

const API_BASE = "http://localhost:4000/api/payment"; // change if your backend is elsewhere

const PLANS = [
  {
    id: 1,
    name: "Free",
    currency: "NGN",
    description: "For individuals and tiny communities getting started.",
    limits: { members: 50, admins: 1, groups: 2, cloudStorage: "500MB" },
    paidCommunity: false,
    eventsDetails: { unlimitedEvents: false, paidEventsFeePercent: "NA", freeEventsFee: "0" },
    transactionFees: { feePercent: "NA" },
    pricing: {
      monthly: { nigeria: "0", africa: "0", restOfWorld: "0" },
      yearly: { nigeria: "0", africa: "0", restOfWorld: "0" },
    },
    features: {
      landing: { landingPage: true },
      authentication: { email: true },
    },
  },
  {
    id: 2,
    name: "Standard",
    currency: "NGN",
    description: "Growing communities: more storage, integrations and moderate admin tools.",
    limits: { members: 1000, admins: 5, groups: 25, cloudStorage: "5GB" },
    paidCommunity: true,
    eventsDetails: { unlimitedEvents: false, paidEventsFeePercent: 5, freeEventsFee: "0" },
    transactionFees: { feePercent: 2.5 },
    pricing: {
      monthly: { nigeria: "5000", africa: "10", restOfWorld: "15" },
      yearly: { nigeria: "50000", africa: "100", restOfWorld: "150" },
    },
    features: {
      authentication: { email: true, socialMedia: true },
      profileManagement: { crudOperations: true, qrCode: true },
      communities: { createNew: true, roles: true },
    },
  },
  {
    id: 3,
    name: "Premium",
    currency: "NGN",
    description: "Full suite: advanced automation, analytics and priority support.",
    limits: { members: "Unlimited", admins: "Unlimited", groups: "Unlimited", cloudStorage: "1TB" },
    paidCommunity: true,
    eventsDetails: { unlimitedEvents: true, paidEventsFeePercent: 2, freeEventsFee: "0" },
    transactionFees: { feePercent: 1.5 },
    pricing: {
      monthly: { nigeria: "10000", africa: "20", restOfWorld: "30" },
      yearly: { nigeria: "100000", africa: "200", restOfWorld: "300" },
    },
    features: {
      authentication: { email: true, socialMedia: true, phoneNumber: true, optionalSSO: true },
      profileManagement: { crudOperations: true, qrCode: true },
      communities: { createNew: true, manageGroups: true, themeBranding: true },
      aiBot: { summarizeChats: true },
    },
  },
];

export default function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [region, setRegion] = useState(() => localStorage.getItem("region") || "nigeria");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // inject pure CSS only once
    if (document.getElementById("subscription-plans-styles")) return;
    const css = `
      .plans-wrap{padding:20px;max-width:1200px;margin:0 auto;font-family:Inter,system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial}
      .plans-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}
      .plans-top .controls{display:flex;gap:8px;align-items:center}
      .cycle-toggle button{padding:8px 14px;border-radius:6px;border:1px solid #d1d5db;background:#fff;cursor:pointer}
      .cycle-toggle .active{background:#0f62fe;color:#fff;border-color:#0f62fe}
      .region-select select{padding:8px;border-radius:6px;border:1px solid #d1d5db}

      .plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
      .plan-card{background:#fff;border:1px solid #e6e9ee;border-radius:10px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;min-height:320px;box-shadow:0 6px 18px rgba(15,23,42,0.06)}
      .plan-head{display:flex;justify-content:space-between;align-items:center}
      .plan-name{font-weight:700;font-size:18px}
      .badge-pop{background:#fffbe6;color:#92400e;padding:4px 8px;border-radius:6px;font-size:12px;border:1px solid #fde3a7}
      .price-row{margin-top:14px}
      .price{font-size:28px;font-weight:800}
      .price-sub{color:#6b7280;font-size:13px;margin-left:8px}
      .desc{color:#374151;margin-top:8px;font-size:14px}

      .plan-meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:14px;font-size:13px}
      .pill{display:inline-block;padding:6px 8px;border-radius:999px;background:#f3f4f6;color:#374151;font-size:12px}

      .plan-actions{display:flex;gap:8px;margin-top:18px}
      .btn-choose{flex:1;background:#0f62fe;color:#fff;padding:10px;border-radius:8px;border:none;cursor:pointer}
      .btn-details{background:transparent;border:1px solid #d1d5db;padding:10px;border-radius:8px;cursor:pointer}
      .btn-choose:disabled{opacity:0.6;cursor:not-allowed}

      /* modal */
      .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:1200}
      .modal-card{background:#fff;border-radius:10px;max-width:900px;width:94%;max-height:92vh;overflow:auto;padding:18px;border:1px solid #e6e9ee}
      .modal-grid{display:grid;grid-template-columns:1fr 320px;gap:18px}
      .feature-box{border:1px solid #f1f5f9;padding:12px;border-radius:8px;background:#fbfdff}
      .modal-actions{display:flex;flex-direction:column;gap:8px}

      /* responsive */
      @media (max-width: 980px){
        .plans-grid{grid-template-columns:repeat(2,1fr)}
        .modal-grid{grid-template-columns:1fr}
      }
      @media (max-width: 640px){
        .plans-grid{grid-template-columns:1fr}
        .plans-top{flex-direction:column;align-items:flex-start}
      }
    `;
    const style = document.createElement("style");
    style.id = "subscription-plans-styles";
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  function formatCurrency(amount, currency = "NGN") {
    if (amount === undefined || amount === null) return `₦0`;
    const n = Number(amount);
    if (Number.isNaN(n)) return `${currency} ${amount}`;
    // show Naira symbol for NGN, otherwise show currency code
    const symbol = currency === "NGN" ? "₦" : currency + " ";
    return `${symbol}${n.toLocaleString()}`;
  }

  function getPrice(plan) {
    const key = billingCycle === "monthly" ? "monthly" : "yearly";
    const regionKey = region === "nigeria" ? "nigeria" : region === "africa" ? "africa" : "restOfWorld";
    const raw = plan.pricing?.[key]?.[regionKey];
    if (raw !== undefined) return raw;
    return 0;
  }

  async function proceedToPayment(plan) {
  setError(null);
  setLoading(true);
  const rawAmount = getPrice(plan);
  const amountNumber = Number(rawAmount);

  if (Number.isNaN(amountNumber)) {
    setError("Invalid plan price");
    setLoading(false);
    return;
  }

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1YzcxNDRkLWZiMGItNGJkZC05NTcyLTViMGQwMGUzOWNiZiIsImlhdCI6MTc1NDgzOTM0NywiZXhwIjoxNzU1MDk4NTQ3fQ.hzFrFKTZNyxBbhIwr0q5-XZ38XqZ2zPY6UbFVzYE6Tc";
  // const email = localStorage.getItem("email") || "";
  if (!token) {
    setLoading(false);
    alert("You must be logged in to start payment. Please login and try again.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/paystack/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // email,
        amount: amountNumber, // frontend sends displayed currency (backend converts to kobo)
        planId: plan.id,
        planType: plan.name, // Changed from planName to planType
        billingCycle,
        region,
        callback_url: `${window.location.origin}/callback`,
      }),
    });

    const data = await res.json();
    if (data?.data?.authorization_url) {
      window.location.href = data.data.authorization_url;
      return;
    }

    setError(data?.message || "Failed to initialize payment");
  } catch (err) {
    setError(err.message || "Payment request failed");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="plans-wrap">
      <div className="plans-top">
        <div>
          <h1 style={{margin:0}}>Choose a Subscription</h1>
          <p style={{margin:'6px 0 0',color:'#6b7280'}}>Pick monthly or yearly billing — switch region to see localized pricing.</p>
        </div>

        <div className="controls" style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="cycle-toggle" role="tablist" aria-label="Billing cycle">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={billingCycle === 'monthly' ? 'active' : ''}
              aria-pressed={billingCycle === 'monthly'}
            >Monthly</button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={billingCycle === 'yearly' ? 'active' : ''}
              aria-pressed={billingCycle === 'yearly'}
            >Yearly</button>
          </div>

          <div className="region-select">
            <select value={region} onChange={(e) => { setRegion(e.target.value); localStorage.setItem('region', e.target.value); }} aria-label="Select region">
              <option value="nigeria">Nigeria</option>
              <option value="africa">Africa</option>
              <option value="restOfWorld">Rest of World</option>
            </select>
          </div>
        </div>
      </div>

      <div className="plans-grid" role="list">
        {PLANS.map((plan) => (
          <article className="plan-card" key={plan.id} role="listitem">
            <div>
              <div className="plan-head">
                <div className="plan-name">{plan.name}</div>
                {plan.name === 'Standard' && <div className="badge-pop">Popular</div>}
              </div>

              <div className="price-row">
                <span className="price">{formatCurrency(getPrice(plan), plan.currency)}</span>
                <span className="price-sub">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                <div className="desc">{plan.description}</div>
              </div>

              <div className="plan-meta" aria-hidden>
                <div>
                  <div style={{color:'#6b7280',fontSize:12}}>Members</div>
                  <div style={{fontWeight:600}}>{String(plan.limits.members)}</div>
                </div>
                <div>
                  <div style={{color:'#6b7280',fontSize:12}}>Admins</div>
                  <div style={{fontWeight:600}}>{String(plan.limits.admins)}</div>
                </div>
                <div>
                  <div style={{color:'#6b7280',fontSize:12}}>Groups</div>
                  <div style={{fontWeight:600}}>{String(plan.limits.groups)}</div>
                </div>
                <div>
                  <div style={{color:'#6b7280',fontSize:12}}>Cloud</div>
                  <div style={{fontWeight:600}}>{plan.limits.cloudStorage}</div>
                </div>
              </div>

              <div style={{marginTop:12}}>
                <span className="pill">{plan.paidCommunity ? 'Paid community' : 'Free community'}</span>
                <span style={{marginLeft:8}} className="pill">Events: {plan.eventsDetails.unlimitedEvents ? 'Unlimited' : 'Limited'}</span>
                <span style={{marginLeft:8}} className="pill">Tx Fee: {String(plan.transactionFees.feePercent)}</span>
              </div>

              <div style={{marginTop:12}}>
                <ul style={{margin:0,paddingLeft:16,color:'#374151'}}>
                  {plan.features.authentication?.email && <li key="a">Email authentication</li>}
                  {plan.features.profileManagement?.crudOperations && <li key="b">Profile management</li>}
                  {plan.features.communities?.createNew && <li key="c">Create & manage communities</li>}
                  {plan.features.aiBot?.summarizeChats && <li key="d">AI chat summary</li>}
                </ul>
              </div>
            </div>

            <div className="plan-actions">
              <button
                className="btn-choose"
                onClick={() => proceedToPayment(plan)}
                disabled={loading}
                aria-label={`Choose ${plan.name} plan`}
              >
                {loading ? 'Processing...' : 'Choose Plan'}
              </button>

              <button
                className="btn-details"
                onClick={() => setSelectedPlan(plan)}
                aria-label={`View ${plan.name} details`}
              >View Details</button>
            </div>
          </article>
        ))}
      </div>

      {/* modal */}
      {selectedPlan && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedPlan(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div>
                <h2 style={{margin:0}}>{selectedPlan.name} — Details</h2>
                <p style={{margin:4,color:'#6b7280'}}>{selectedPlan.description}</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} style={{border:'none',background:'transparent',cursor:'pointer'}}>Close</button>
            </div>

            <div className="modal-grid">
              <div>
                <h4 style={{marginTop:0}}>Features</h4>
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
                  {Object.entries(selectedPlan.features).map(([k, v]) => (
                    <div className="feature-box" key={k}>
                      <strong style={{textTransform:'capitalize'}}>{k.replace(/([A-Z])/g,' $1')}</strong>
                      <ul style={{marginTop:8,paddingLeft:16}}>
                        {v && typeof v === 'object' ? (
                          Object.entries(v).map(([fk, fv]) => (
                            <li key={fk}>{typeof fv === 'boolean' ? (fv ? fk : null) : `${fk}: ${String(fv)}`}</li>
                          ))
                        ) : (
                          <li className="text-muted">No items</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{marginTop:18}}>
                  <h4>Limits & Events</h4>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginTop:8}}>
                    <div className="feature-box">
                      <div style={{color:'#6b7280',fontSize:13}}>Members</div>
                      <div style={{fontWeight:700}}>{String(selectedPlan.limits.members)}</div>
                    </div>
                    <div className="feature-box">
                      <div style={{color:'#6b7280',fontSize:13}}>Admins</div>
                      <div style={{fontWeight:700}}>{String(selectedPlan.limits.admins)}</div>
                    </div>
                    <div className="feature-box">
                      <div style={{color:'#6b7280',fontSize:13}}>Groups</div>
                      <div style={{fontWeight:700}}>{String(selectedPlan.limits.groups)}</div>
                    </div>
                    <div className="feature-box">
                      <div style={{color:'#6b7280',fontSize:13}}>Cloud Storage</div>
                      <div style={{fontWeight:700}}>{String(selectedPlan.limits.cloudStorage)}</div>
                    </div>
                    <div className="feature-box">
                      <div style={{color:'#6b7280',fontSize:13}}>Unlimited Events</div>
                      <div style={{fontWeight:700}}>{String(selectedPlan.eventsDetails.unlimitedEvents)}</div>
                    </div>
                    <div className="feature-box">
                      <div style={{color:'#6b7280',fontSize:13}}>Paid events fee %</div>
                      <div style={{fontWeight:700}}>{String(selectedPlan.eventsDetails.paidEventsFeePercent)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <aside>
                <div style={{border:'1px solid #f1f5f9',padding:12,borderRadius:8}}>
                  <div style={{fontSize:13,color:'#6b7280'}}>You selected</div>
                  <div style={{fontWeight:700,fontSize:18,marginTop:6}}>{selectedPlan.name}</div>
                  <div style={{marginTop:10,fontSize:20,fontWeight:800}}>{formatCurrency(getPrice(selectedPlan), selectedPlan.currency)} <span style={{fontSize:12,color:'#6b7280',marginLeft:6}}>/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span></div>

                  <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:8}}>
                    <button className="btn-choose" onClick={() => proceedToPayment(selectedPlan)} disabled={loading}>{loading ? 'Processing...' : 'Proceed to Payment'}</button>
                    <button onClick={() => setSelectedPlan(null)} className="btn-details">Cancel</button>
                  </div>

                  {error && <div style={{marginTop:10,color:'#b91c1c'}}>{error}</div>}

                  <div style={{marginTop:12,fontSize:12,color:'#6b7280'}}>Note: frontend sends displayed amount (e.g. NGN). Your backend must convert to the smallest currency unit (kobo) before calling Paystack.</div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
