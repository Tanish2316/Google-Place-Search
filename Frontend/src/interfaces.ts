export interface GoogleData {
    latitude?: string;
    longitude?: string;
    displayName?: string;
    placeId: string;
    addressline1?: string;
    addressline2?: string;
    city: string;
    state: string;
    country: string;
    pincode?: string;
}

export interface AddressComponent {
    types?: string[];
    longText?: string;
    shortText?: string;
}

export interface Location {
    latitude?: string;
    longitude?: string;
}

export interface AddressDetails {
    formattedAddress?: string;
    pincode?: string;
    city?: string;
    state?: string;
    country?: string;
    placeId?: string;
    types?: string[];
    businessStatus?: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
    location?: Location;
    googleMapsUri?: string;
    websiteUri?: string;
    addressComponents?: AddressComponent[];
    displayName?: {
        text?: string;
    };
}

export interface GoogleSearchProps {
    googleData: GoogleData | null;
}
