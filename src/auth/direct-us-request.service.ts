import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from './auth.service';
@Injectable()
export class DirectusRequestService {
    private access_token: string;
    private expiry: number;
    private refresh_token: string;
    private readonly DIRECTUS_BASE_URL = process.env.DIRECTUS_BASE_URL;

    private readonly logger = new Logger(DirectusRequestService.name);

    constructor(private readonly authService: AuthService) {
    }

    async getRequest(endpointUrl: string, resource: string) {
        const access_token = await this.authService.getAccessToken();
        try {
            const response = await axios.get(`${this.DIRECTUS_BASE_URL}+${endpointUrl}`, {
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
