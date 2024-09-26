import { Module } from '@nestjs/common';
import { UpdateFilesController } from './update-files.controller';
import { UpdateFileService } from './update-files.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { DirectusModule } from 'src/students/directus-students.module';
import { DirectusStudentsService } from 'src/students/directus-students.service';
@Module({
    imports: [AuthModule, DirectusModule],
    controllers: [UpdateFilesController],
    providers: [UpdateFileService, AuthService, DirectusStudentsService],
})
export class UpdateFilesModule {

}
