import { Module } from '@nestjs/common';
import { DirectusStudentsController } from './directus-students.controller';
import { DirectusStudentsService } from './directus-students.service';


@Module({
    controllers: [DirectusStudentsController],
    providers: [DirectusStudentsService],
})
export class DirectusModule {

}
