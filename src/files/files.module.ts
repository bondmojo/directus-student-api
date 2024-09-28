import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FileService } from './files.service';
import { APIModule } from '../apis/api.module';
import { AuthService } from '../apis/auth.service';
import { DirectusStudentsModule } from '../students/directus-students.module';
import { DirectusStudentsService } from '../students/directus-students.service';
import { DirectusAPIService } from '../apis/du-api-request.service';
@Module({
    imports: [APIModule, DirectusStudentsModule],
    controllers: [FilesController],
    providers: [FileService, AuthService, DirectusAPIService, DirectusStudentsService],
})
export class FilesModule {
}
