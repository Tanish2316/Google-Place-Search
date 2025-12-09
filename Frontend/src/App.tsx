import { useState } from "react";
import CityStateCountry from "./components/city-state-country/CityStateCountryTab";
import AddressTab from "./components/address/AddressTab";

function App() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "10px 0",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "fit-content",
          margin: "0 auto 12px",
          background: "#e3e3e3",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #ccc",
        }}
      >
        <button
          style={{
            padding: "12px 28px",
            border: "none",
            background: activeTab === 0 ? "#fff" : "transparent",
            color: activeTab === 0 ? "#1976d2" : "#444",
            fontWeight: activeTab === 0 ? "600" : "500",
            cursor: "pointer",
            borderBottom:
              activeTab === 0 ? "2px solid white" : "2px solid transparent",
            boxShadow:
              activeTab === 0
                ? "0 -2px 8px rgba(25,118,210,0.2)"
                : "none",
            transition: "all 0.2s ease",
          }}
          onClick={() => setActiveTab(0)}
        >
          Address Search
        </button>

        <button
          style={{
            padding: "12px 28px",
            border: "none",
            background: activeTab === 1 ? "#fff" : "transparent",
            color: activeTab === 1 ? "#1976d2" : "#444",
            fontWeight: activeTab === 1 ? "600" : "500",
            cursor: "pointer",
            borderBottom:
              activeTab === 1 ? "2px solid white" : "2px solid transparent",
            boxShadow:
              activeTab === 1
                ? "0 -2px 8px rgba(25,118,210,0.2)"
                : "none",
            transition: "all 0.2s ease",
          }}
          onClick={() => setActiveTab(1)}
        >
          City-State-Country
        </button>
      </div>

      <div>
        {activeTab === 0 && <AddressTab />}
        {activeTab === 1 && <h2><CityStateCountry /></h2>}
      </div>
    </div>
  );

}

export default App;
