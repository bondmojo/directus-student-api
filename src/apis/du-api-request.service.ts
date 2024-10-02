import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from './auth.service';
@Injectable()
export class DirectusAPIService {
    private access_token: string;
    private expiry: number;
    private refresh_token: string;
    private readonly DIRECTUS_BASE_URL = process.env.DIRECTUS_BASE_URL;

    private readonly logger = new Logger(DirectusAPIService.name);

    constructor(private readonly authService: AuthService) {
    }

    /*async getRequest(endpointUrl: string, resource: string) {
         const access_token = await this.authService.getAccessToken();
         const url = this.DIRECTUS_BASE_URL + endpointUrl;
         this.logger.log("url=" + url);
         try {
             const response = await axios.get(url, {
                 headers: {
                     Authorization: `Bearer ${access_token}`,
                 },
             });
             this.logger.log(resource + " response received" + JSON.stringify(response.data.data));
             return response.data.data;
         }
         catch (error) {
             throw error;
         }
 
     }*/

    async getAccessToken() {
        return await this.authService.getAccessToken();
    }

    async getRequest(endpointUrl: string, resource: string, paramObj?: { key: string, value: any }) {
        const access_token = await this.authService.getAccessToken();
        const url = this.DIRECTUS_BASE_URL + endpointUrl;
        this.logger.log("url=" + url);

        const params = paramObj ? { [paramObj.key]: paramObj.value } : {};
        this.logger.log("params:" + JSON.stringify(params));

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                //params
            },
            );

            // if resource type is downloadStudentPhotos response contains binary data of photo
            if (resource === "downloadStudentPhotos") {
                return response;
            }
            this.logger.log(resource + " response received" + JSON.stringify(response.data.data));
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    }

    async patchRequest(endpointUrl: string, resource: string, reqBody: any) {
        const access_token = await this.authService.getAccessToken();
        const url = this.DIRECTUS_BASE_URL + endpointUrl;
        this.logger.log("url=" + url + ". Request Body =" + JSON.stringify(reqBody));
        try {
            const response = await axios.patch(url, reqBody, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },

            });
            this.logger.log(resource + " patch response received" + JSON.stringify(response.data.data));
            return response.data.data;
        }
        catch (error) {
            throw error;
        }

    }

    async postRequest(endpointUrl: string, resource: string, reqBody: any) {
        const access_token = await this.authService.getAccessToken();
        const url = this.DIRECTUS_BASE_URL + endpointUrl;
        this.logger.log("url=" + url + " REQ BODY =" + JSON.stringify(reqBody));
        try {
            const response = await axios.post(url, reqBody, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            this.logger.log(resource + " response received" + JSON.stringify(response.data.data));
            return response.data.data;
        }
        catch (error) {
            throw error;
        }
    }

}
