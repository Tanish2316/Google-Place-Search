import React, { useEffect, useState } from 'react';
import { APIFetchMapboxDetails } from '../api-service';
import {
    GoogleData,
    AddressComponent,
    Location,
    AddressDetails,
    GoogleSearchProps
} from '../interfaces';

function GoogleSearchDetails({ googleData }: GoogleSearchProps) {
    const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            if (googleData && googleData.placeId && googleData.placeId.trim() !== '') {
                setIsLoading(true);
                try {
                    const { placeId } = googleData;
                    const resp = await APIFetchMapboxDetails(placeId);
                    const respData = resp?.data;

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

                    setAddressDetails(respData);
                } catch (error) {
                    console.error('Error fetching address details:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setAddressDetails(null);
                setIsLoading(false);
            }
        }
        fetchData();
    }, [googleData?.placeId]);

    return (
        <div className="mt-4 px-3">
            <div className="card shadow rounded-3">
                <div className="card-body p-4">
                    <h4 className="text-center mb-4 text-primary fw-bold">
                        Details based on ID
                    </h4>

                    {isLoading ? (
                        <div className="text-center py-4">
                            <p className="mt-2">Loading address details...</p>
                        </div>
                    ) : addressDetails ? (
                        <div>
                            <div className="mb-4">
                                <strong>Address Name</strong>
                                <div className="text-muted">
                                    {addressDetails.displayName?.text || 'N/A'}
                                </div>
                            </div>
                            <div className="mb-4">
                                <strong>Full Address</strong>
                                <div className="text-muted">
                                    {addressDetails.formattedAddress || 'N/A'}
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-3">
                                    <strong>Pincode</strong>
                                    <div className="text-muted">{addressDetails.pincode || 'N/A'}</div>
                                </div>
                                <div className="col-md-3">
                                    <strong>City</strong>
                                    <div className="text-muted">{addressDetails.city || 'N/A'}</div>
                                </div>
                                <div className="col-md-3">
                                    <strong>State</strong>
                                    <div className="text-muted">{addressDetails.state || 'N/A'}</div>
                                </div>
                                <div className="col-md-3">
                                    <strong>Country</strong>
                                    <div className="text-muted">{addressDetails.country || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <strong>Place Id</strong>
                                    <div className="text-muted">{googleData?.placeId || 'N/A'}</div>
                                </div>
                                <div className="col-md-4">
                                    <strong>Types</strong>
                                    <div className="text-muted">
                                        {addressDetails.types?.join(', ') || 'N/A'}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <strong>Business Status</strong>
                                    <div className="text-muted">
                                        {addressDetails.businessStatus || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-3">
                                    <strong>National Phone</strong>
                                    <div className="text-muted">
                                        {addressDetails.nationalPhoneNumber || 'N/A'}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <strong>International Phone</strong>
                                    <div className="text-muted">
                                        {addressDetails.internationalPhoneNumber || 'N/A'}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <strong>Latitude</strong>
                                    <div className="text-muted">
                                        {addressDetails.location?.latitude || 'N/A'}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <strong>Longitude</strong>
                                    <div className="text-muted">
                                        {addressDetails.location?.longitude || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-3">
                                    <a
                                        href={addressDetails.googleMapsUri || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary w-100"
                                    >
                                        Google Map Link
                                    </a>
                                </div>

                                <div className="col-md-3">
                                    <a
                                        href={addressDetails.websiteUri || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary w-100"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-4">
                            <p>No address details available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GoogleSearchDetails