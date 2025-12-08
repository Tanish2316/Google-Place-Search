import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import './GoogleSearch.css';
import { APIFetchAddress } from '../api-service';
import { GoogleData } from '../interfaces';

interface GoogleSearchProps {
  onSuggestionSelect: (data: GoogleData) => void;
}

function GoogleSearch({ onSuggestionSelect }: GoogleSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [addressData, setAddressData] = useState({
    addressline1: '',
    addressline2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    latitude: '',
    longitude: '',
    placeId: ''
  });

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
    const googlePlaceId = place?.id || '';

    return {
      addressline1: line1,
      addressline2: line2,
      city: extractedCity,
      state: extractedState,
      country: extractedCountry,
      pincode: extractedPincode,
      latitude: lat,
      longitude: lng,
      placeId: googlePlaceId
    };
  };

  const handleSelect = (e: any) => {
    setSearchQuery("");
    setSelected(e.value);

    const locationData = extractLocationData(e.value);
    setAddressData(locationData);

    const googleData: GoogleData = {
      placeId: locationData.placeId,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
    };
    onSuggestionSelect(googleData);
  }

  const handleClear = () => {
    setAddressData({
      addressline1: '',
      addressline2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      latitude: '',
      longitude: '',
      placeId: ''
    });
    setSelected(null);
    onSuggestionSelect({
      city: '',
      state: '',
      country: '',
      placeId: ''
    });
  }

  return (
    <div className="mt-4 px-2">
      <div className="card shadow">
        <div className="card-body p-4">
          <h1 className="text-center mb-4 text-primary fw-bold">Google Places</h1>

          <div className="mb-5">
            <div className="gs-input-container">
              <AutoComplete
                value={searchQuery}
                suggestions={suggestions}
                completeMethod={search}
                field="formattedAddress"
                itemTemplate={itemTemplate}
                onChange={(e) => {
                  setSearchQuery(e.value)
                  handleClear()
                }
                }
                onSelect={handleSelect}
                onClear={() => {
                  handleClear();
                }}
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
                value={addressData.addressline1}
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
                value={addressData.addressline2}
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
                value={addressData.pincode}
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
                value={addressData.city}
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
                value={addressData.state}
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
                value={addressData.country}
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
                value={addressData.latitude}
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
                value={addressData.longitude}
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
        </div>
      </div>
    </div>
  );
}

export default GoogleSearch;
