import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DirectusAPIService } from './du-api-request.service';
@Module({
    providers: [AuthService, DirectusAPIService],
})
export class APIModule { }
