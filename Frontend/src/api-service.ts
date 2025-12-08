import { AxiosResponse } from "axios";
import axios from "axios";

export const APIFetchAddress = async (
    reqBody: { textQuery: string }
): Promise<AxiosResponse> => {
    return await axios.post("https://google-place-search-1.onrender.com/search", reqBody
    );
};


export const APIFetchMapboxDetails = async (
    placeId: string
): Promise<AxiosResponse> => {
    return await axios.get(`https://google-place-search-1.onrender.com/get-google-details/${placeId}`
    );
};