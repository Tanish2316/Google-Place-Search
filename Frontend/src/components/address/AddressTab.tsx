import React from 'react'
import { GoogleData } from '../../interfaces';
import GooglePlaces from './GooglePlaces';
import GooglePlacesDetails from './GooglePlacesDetails';


function AddressTab() {
    const [googleData, setGoogleData] = React.useState<GoogleData | null>(null);

    const handleSuggestionSelect = (data: GoogleData) => {
        setGoogleData(data);
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6">
                    <GooglePlaces onSuggestionSelect={handleSuggestionSelect} />
                </div>
                <div className="col-lg-6">
                    <GooglePlacesDetails googleData={googleData} />
                </div>
            </div>
        </div>
    )
}

export default AddressTab