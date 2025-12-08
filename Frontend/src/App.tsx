import { useState } from "react";
import GoogleSearch from "./components/GoogleSearch";
import GoogleSearchDetails from "./components/GoogleSearchDetails";
import { GoogleData } from "./interfaces";

function App() {
  const [googleData, setGoogleData] = useState<GoogleData | null>(null);

  const handleSuggestionSelect = (data: GoogleData) => {
    setGoogleData(data);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '20px 0',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <GoogleSearch onSuggestionSelect={handleSuggestionSelect} />
          </div>
          <div className="col-lg-6">
            <GoogleSearchDetails googleData={googleData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
