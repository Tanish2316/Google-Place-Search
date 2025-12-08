import { AxiosResponse } from "axios";
import axios from "axios";

export const APIFetchAddress = async (
    reqBody: { textQuery: string }
): Promise<AxiosResponse> => {
    return await axios.post("https://google-place-search-1.onrender.com/search", reqBody
    );
};


export const APIFetchMapboxDetails = async (
    reqBody: { latitude: string; longitude: string }
): Promise<AxiosResponse> => {
    return await axios.post("https://google-place-search-1.onrender.com/get-mapbox-details", reqBody
    );
};