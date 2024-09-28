import { Module } from '@nestjs/common';
import { DirectusStudentsController } from './directus-students.controller';
import { DirectusStudentsService } from './directus-students.service';
import { APIModule } from 'src/apis/api.module';
import { DirectusAPIService } from 'src/apis/du-api-request.service';
import { AuthService } from '../apis/auth.service';


@Module({
    imports: [APIModule],
    controllers: [DirectusStudentsController],
    providers: [DirectusStudentsService, DirectusAPIService, AuthService],
})
export class DirectusStudentsModule {

}
