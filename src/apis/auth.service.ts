import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class AuthService {
    private access_token: string;
    private expiry: number;
    private refresh_token: string;
    private readonly DIRECTUS_BASE_URL = process.env.DIRECTUS_BASE_URL;
    private readonly LOGIN_ENDPOINT = process.env.LOGIN;
    private readonly EMAIL = process.env.DIRECTUS_EMAIL;
    private readonly PASSWORD = process.env.DIRECTUS_PASSWORD;

    private readonly logger = new Logger(AuthService.name);

    constructor() {
    }

    async login(): Promise<any> {
        try {
            const loginEndpointUrl = this.DIRECTUS_BASE_URL + this.LOGIN_ENDPOINT;
            this.logger.log(loginEndpointUrl + " " + this.EMAIL + " " + this.PASSWORD);
            const response = await axios.post(loginEndpointUrl,
                {
                    "email": this.EMAIL,
                    "password": this.PASSWORD
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            this.logger.log("login response received" + JSON.stringify(response.data.data));
            return response.data.data;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                'Failed to obtain login ',
                400,
            );
        }
    }

    async getAccessToken(): Promise<string> {
        const now = Date.now();
        if (!this.access_token || now > this.expiry) {
            const result = await this.login();
            this.access_token = result.access_token;
            this.expiry = Date.now() + result.expires;
        }
        return this.access_token;

    }



    /* async getUser(): Promise<any> {
         try {
             const user = await this.directus.users.me.read();
             return user;
         } catch (error) {
             throw new Error('Failed to fetch user data: ' + error.message);
         }
     }*/
}
