import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import './GoogleSearch.css';
import { APIFetchAddress } from './api-service';

function GoogleSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [addressline1, setAddressline1] = useState('');
  const [addressline2, setAddressline2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [showFullObject, setShowFullObject] = useState(false);

  const search = (event: any) => {
    const query = event.query;

    APIFetchAddress({ textQuery: query })
      .then((response) => {
        const places = response.data.places || [];
        setSuggestions(places);
      })
      .catch((error) => {
        console.error("Error fetching address suggestions:", error);
        setSuggestions([]);
      });
  };

  const itemTemplate = (place: any) => {
    return (
      <div className="suggestion-item">
        <div className="suggestion-main">{place.displayName?.text || 'Unknown Place'}</div>
        <div className="suggestion-address">{place.formattedAddress}</div>
      </div>
    );
  };

  const extractAddressLines = (
    fullAddress: string,
    city: string,
    state: string,
    country: string,
    pincode: string
  ) => {
    if (!fullAddress) return { line1: "", line2: "" };

    let cleanAddress = fullAddress;

    [city, state, country, pincode].forEach((val) => {
      if (val && typeof val === "string") {
        cleanAddress = cleanAddress.replace(val, "");
      }
    });

    cleanAddress = cleanAddress.replace(/,+/g, ",").trim();
    if (cleanAddress.endsWith(",")) {
      cleanAddress = cleanAddress.slice(0, -1).trim();
    }

    const parts = cleanAddress
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const half = Math.ceil(parts.length / 2);
    const line1 = parts.slice(0, half).join(", ");
    const line2 = parts.slice(half).join(", ");

    return { line1, line2 };
  };


  const extractLocationData = (place: any) => {
    const addressComponents = place?.addressComponents || [];
    let extractedCity = '';
    let extractedState = '';
    let extractedCountry = '';
    let extractedPincode = '';

    addressComponents.forEach((component: any) => {
      const types = component.types || [];
      if (types.includes('locality') || types.includes('sublocality')) {
        extractedCity = component.longText || component.shortText || '';
      }
      if (types.includes('administrative_area_level_1')) {
        extractedState = component.longText || component.shortText || '';
      }
      if (types.includes('country')) {
        extractedCountry = component.longText || component.shortText || '';
      }
      if (types.includes('postal_code')) {
        extractedPincode = component.longText || component.shortText || '';
      }
    });

    const { line1, line2 } = extractAddressLines(
      place?.formattedAddress || '',
      extractedCity,
      extractedState,
      extractedCountry,
      extractedPincode
    );

    const location = place?.location || {};
    const lat = location.latitude?.toString() || '';
    const lng = location.longitude?.toString() || '';

    return {
      addressline1: line1,
      addressline2: line2,
      city: extractedCity,
      state: extractedState,
      country: extractedCountry,
      pincode: extractedPincode,
      latitude: lat,
      longitude: lng
    };
  };

  const handleSelect = (e: any) => {
    setSearchQuery("")
    setSelected(e.value);

    const locationData = extractLocationData(e.value);
    setAddressline1(locationData.addressline1);
    setAddressline2(locationData.addressline2);
    setCity(locationData.city);
    setState(locationData.state);
    setCountry(locationData.country);
    setPincode(locationData.pincode);
    setLatitude(locationData.latitude);
    setLongitude(locationData.longitude);
  }

  const handleClear = () => {
    setAddressline1('');
    setAddressline2('');
    setCity('');
    setState('');
    setCountry('');
    setPincode('');
    setLatitude('');
    setLongitude('');
    setSelected(null);
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="text-center mb-4 text-primary fw-bold">Google Places Search</h1>

              <div className="mb-5">
                <div className="gs-input-container">
                  <AutoComplete
                    value={searchQuery}
                    suggestions={suggestions}
                    completeMethod={search}
                    field="formattedAddress"
                    itemTemplate={itemTemplate}
                    onChange={(e) => setSearchQuery(e.value)}
                    onSelect={handleSelect}
                    onClear={() => setSelected(null)}
                    placeholder="Type to search for places..."
                    forceSelection={false}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Selected Address Name</label>
                <input
                  autoComplete='one-time-code'
                  type="text"
                  className="form-control"
                  name='fullAddress'
                  value={selected ? selected.displayName?.text : ''}
                  readOnly
                  style={{ cursor: 'not-allowed' }}
                />
              </div>

              <div className="row mb-4">
                <div className='col-md-6'>
                  <label className="form-label fw-semibold">Address Line 1</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='projectAddressLine1'
                    value={addressline1}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
                <div className='col-md-6'>
                  <label className="form-label fw-semibold">Address Line 2</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='projectAddressLine2'
                    value={addressline2}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Pincode</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='pincode'
                    value={pincode}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='city'
                    value={city}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">State</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='state'
                    value={state}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>

              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Country</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='country'
                    value={country}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Latitude</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='latitude'
                    value={latitude}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Longitude</label>
                  <input
                    autoComplete='one-time-code'
                    type="text"
                    className="form-control"
                    name='longitude'
                    value={longitude}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleClear}
                  aria-label="Clear address fields"
                >
                  Clear
                </button>
              </div>
              {/* {selected && (
                <div className="mt-4 text-center">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowFullObject(!showFullObject)}
                  >
                    {showFullObject ? 'Hide Full Object' : 'Show Full Object'}
                  </button>

                  {showFullObject && (
                    <div className="mt-3">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title text-primary">Selected Place Object:</h6>
                          <pre style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                            fontSize: "14px",
                          }}>
                            {JSON.stringify(selected, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default GoogleSearch;
