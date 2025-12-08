import { useState } from "react";
import GoogleSearch from "./GoogleSearch";
import MapboxSearch from "./MapboxSearch";

interface CoordinateData {
  latitude: string;
  longitude: string;
  displayName?: string;
  formattedAddress?: string;
  addressline1?: string;
  addressline2?: string;
  city: string;
  state: string;
  country: string;
  pincode?: string;
}

function App() {
  const [coordinateData, setCoordinateData] = useState<CoordinateData | null>(null);

  const handleCoordinateSelect = (data: CoordinateData) => {
    setCoordinateData(data);
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
            <GoogleSearch onCoordinateSelect={handleCoordinateSelect} />
          </div>
          <div className="col-lg-6">
            <MapboxSearch coordinateData={coordinateData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
