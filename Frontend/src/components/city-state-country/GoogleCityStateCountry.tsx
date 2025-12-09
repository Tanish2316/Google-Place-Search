import { AutoComplete } from "primereact/autocomplete";
import React, { useState } from "react";
import { APIFetchCityStateCountry, APIGoogleDetails } from "../../api-service";
import { AddressComponent } from "../../interfaces";

function GoogleCityStateCountry() {
    const [category, setCategory] = useState("administrative_area_level_3,locality");
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSelect = async (e: any) => {
        setSearchTerm("");
        const selected = e.value;
        const placeId = selected?.placePrediction?.placeId || '';
        setIsLoading(true);
        try {
            const resp = await APIGoogleDetails(placeId);
            const respData = resp?.data;
            console.log("Detail Response:", respData);
            const addressComponents: AddressComponent[] = respData?.addressComponents || [];

            let extractedCity = '';
            let extractedState = '';
            let extractedCountry = '';
            let extractedPincode = '';

            addressComponents.forEach((component) => {
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

            respData.city = extractedCity;
            respData.state = extractedState;
            respData.country = extractedCountry;
            respData.pincode = extractedPincode;
            setSelectedSuggestion(respData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error handling selection:", error);
        }

    };

    const search = async (event: { query: string }) => {
        setSelectedSuggestion(null);
        const query = event.query;
        const reqBody = { input: query, category: category.split(",") };
        try {
            const response = await APIFetchCityStateCountry(reqBody);
            const places = response?.data?.suggestions || [];
            setSuggestions(places);
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
            setSuggestions([]);
        }
    };

    const itemTemplate = (item: any) => {
        return (
            <div>
                {item.placePrediction?.text?.text}
            </div>
        );
    };

    const handleClear = () => {
        setSelectedSuggestion(null);
    };

    return (
        <div className="mt-4 px-3">
            <div className="card shadow rounded-3">
                <div className="card-body p-4">
                    <h3 className="text-center mb-4 text-primary fw-bold">
                        City-State-Country Search
                    </h3>
                    <div className="mb-4">
                        <strong className="d-block mb-2 fs-5">Select Category</strong>
                        <div className="d-flex gap-4 align-items-center">
                            <div className="form-check" style={{ transform: "scale(0.85)" }}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchType"
                                    id="city"
                                    value="administrative_area_level_3,locality"
                                    checked={category === "administrative_area_level_3,locality"}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                <label className="form-check-label ms-1 fs-5" htmlFor="city">
                                    City
                                </label>
                            </div>

                            <div className="form-check" style={{ transform: "scale(0.85)" }}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchType"
                                    id="state"
                                    value="administrative_area_level_1"
                                    checked={category === "administrative_area_level_1"}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                <label className="form-check-label ms-1 fs-5" htmlFor="state">
                                    State
                                </label>
                            </div>

                            <div className="form-check" style={{ transform: "scale(0.85)" }}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchType"
                                    id="country"
                                    value="country"
                                    checked={category === "country"}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                <label className="form-check-label ms-1 fs-5" htmlFor="country">
                                    Country
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="gs-input-container">
                        <AutoComplete value={searchTerm}
                            suggestions={suggestions}
                            completeMethod={search}
                            field="placePrediction.text.text"
                            itemTemplate={itemTemplate}
                            onChange={(e) => { setSearchTerm(e.value) }}
                            onSelect={handleSelect}
                            placeholder="Enter City, State or Country..."
                            forceSelection={false} />
                    </div>
                    {
                        isLoading ? (
                            <div className="text-center py-4" >
                                <p className="mt-2 fs-6">Loading details...</p>
                            </div>
                        ) : selectedSuggestion ? (
                            <div className="mt-4 fs-6">
                                <div className="mb-4">
                                    <strong>Search Name</strong>
                                    <div className="text-muted">
                                        {selectedSuggestion.displayName?.text || 'N/A'}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <strong>Full Name</strong>
                                    <div className="text-muted">
                                        {selectedSuggestion.formattedAddress || 'N/A'}
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-4">
                                        <strong>City</strong>
                                        <div className="text-muted">{selectedSuggestion.city || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <strong>State</strong>
                                        <div className="text-muted">{selectedSuggestion.state || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <strong>Country</strong>
                                        <div className="text-muted">{selectedSuggestion.country || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <strong>Place Id</strong>
                                        <div className="text-muted">{selectedSuggestion?.id || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Types</strong>
                                        <div className="text-muted">
                                            {selectedSuggestion.types?.join(', ') || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-3">
                                        <strong>Latitude</strong>
                                        <div className="text-muted">
                                            {selectedSuggestion.location?.latitude || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <strong>Longitude</strong>
                                        <div className="text-muted">
                                            {selectedSuggestion.location?.longitude || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <a
                                            href={selectedSuggestion.googleMapsUri || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary w-100"
                                        >
                                            Google Map Link
                                        </a>
                                    </div>
                                    <div className="col-md-3 ms-auto d-flex justify-content-end align-items-center">
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
                        ) : (
                            <div className="text-center text-muted mt-5 py-4 fs-6">
                                <p>No details available</p>
                            </div>
                        )}
                </div>
            </div>
        </div >
    );
}

export default GoogleCityStateCountry;
