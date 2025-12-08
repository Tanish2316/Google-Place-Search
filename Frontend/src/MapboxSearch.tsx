import axios from 'axios';
import React, { use, useEffect } from 'react'

interface CoordinateData {
    latitude: string;
    longitude: string;
    displayName?: string;
    mapboxId?: string;
    addressline1?: string;
    addressline2?: string;
    city: string;
    state: string;
    country: string;
    pincode?: string;
}

interface MapboxSearchProps {
    coordinateData: CoordinateData | null;
}

function MapboxSearch({ coordinateData }: MapboxSearchProps) {

    const [addressDetails, setAddressDetails] = React.useState<CoordinateData | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (coordinateData && coordinateData.latitude && coordinateData.longitude && coordinateData.latitude.trim() !== '' && coordinateData.longitude.trim() !== '') {
                const { latitude, longitude } = coordinateData;

                const resp = await axios.post('http://localhost:5000/get-mapbox-details', {
                    latitude,
                    longitude
                });

                const data = resp.data;
                setAddressDetails(data);
            }else{
                setAddressDetails(null);
            }
        }
        fetchData();
    }, [coordinateData?.latitude, coordinateData?.longitude]);

    return (
        <div className="mt-4 px-2">
            <div className="card shadow">
                <div className="card-body p-4">
                    <h1 className="text-center mb-4 text-primary fw-bold">MapBox Result</h1>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">MapBox Address Name</label>
                        <input
                            autoComplete='one-time-code'
                            type="text"
                            className="form-control"
                            name='fullAddress'
                            value={addressDetails?.displayName || ''}
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
                                value={addressDetails?.addressline1 || ''}
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
                                value={addressDetails?.addressline2 || ''}
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
                                value={addressDetails?.pincode || ''}
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
                                value={addressDetails?.city || ''}
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
                                value={addressDetails?.state || ''}
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
                                value={addressDetails?.country || ''}
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
                                value={addressDetails?.latitude || ''}
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
                                value={addressDetails?.longitude || ''}
                                readOnly
                                style={{ cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mapbox Id</label>
                        <input
                            autoComplete='one-time-code'
                            type="text"
                            className="form-control"
                            name='formattedAddress'
                            value={addressDetails?.mapboxId || ''}
                            readOnly
                            style={{ cursor: 'not-allowed' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapboxSearch