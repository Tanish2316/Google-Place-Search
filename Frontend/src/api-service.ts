import { AxiosResponse } from "axios";
import axios from "axios";

export const APIFetchAddress = async (
    reqBody: { textQuery: string }
): Promise<AxiosResponse> => {
    return await axios.post("http://localhost:5000/search", reqBody
    );
};