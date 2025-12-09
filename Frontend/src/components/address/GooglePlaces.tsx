import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import { APIFetchAddress } from '../../api-service';
import { GoogleData } from '../../interfaces';

interface GoogleSearchProps {
  onSuggestionSelect: (data: GoogleData) => void;
}

function GooglePlaces({ onSuggestionSelect }: GoogleSearchProps) {
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

  const search = async (event: { query: string }) => {
    const query = event.query;
    try {
      const response = await APIFetchAddress({ textQuery: query });
      const places = response?.data?.places ?? [];
      setSuggestions(places);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    }
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
          <h3 className="text-center mb-4 text-primary fw-bold">Google Places</h3>

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
          {selected ? (
            <div>
              <div className="mb-4">
                <strong>Selected Address Name</strong>
                <div className="text-muted">
                  {selected?.displayName?.text || "N/A"}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <strong>Address Line 1</strong>
                  <div className="text-muted">
                    {addressData.addressline1 || "N/A"}
                  </div>
                </div>

                <div className="col-md-6">
                  <strong>Address Line 2</strong>
                  <div className="text-muted">
                    {addressData.addressline2 || "N/A"}
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <strong>Pincode</strong>
                  <div className="text-muted">
                    {addressData.pincode || "N/A"}
                  </div>
                </div>

                <div className="col-md-4">
                  <strong>City</strong>
                  <div className="text-muted">
                    {addressData.city || "N/A"}
                  </div>
                </div>

                <div className="col-md-4">
                  <strong>State</strong>
                  <div className="text-muted">
                    {addressData.state || "N/A"}
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <strong>Country</strong>
                  <div className="text-muted">
                    {addressData.country || "N/A"}
                  </div>
                </div>

                <div className="col-md-4">
                  <strong>Latitude</strong>
                  <div className="text-muted">
                    {addressData.latitude || "N/A"}
                  </div>
                </div>

                <div className="col-md-4">
                  <strong>Longitude</strong>
                  <div className="text-muted">
                    {addressData.longitude || "N/A"}
                  </div>
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
          ) : (
            <div className="text-center text-muted">
              No address selected. Please search and select an address.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GooglePlaces;
