import axios from "axios";
import {AppConfig} from "../config/app";

export async function checkUserSlug(slug) {
    const resp = await axios.get(AppConfig.API_ENDPOINT + '/check', {params: {slug}})
    return resp.data
}
