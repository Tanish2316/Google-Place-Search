import React from 'react'
import GoogleCityStateCountryDetails from './GoogleCityStateCountryDetails'
import GoogleCityStateCountry from './GoogleCityStateCountry'

function CityStateCountry() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6">
                    <GoogleCityStateCountry />
                </div>
                <div className="col-lg-6">
                    <GoogleCityStateCountryDetails />
                </div>
            </div>
        </div>
    )
}

export default CityStateCountry