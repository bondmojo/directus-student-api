import { AuthenticationClient, authentication, createDirectus, rest, readItems } from '@directus/sdk';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';
import { DirectusStudentsService } from 'src/students/directus-students.service';

@Injectable()
export class UpdateFileService {

    private readonly logger = new Logger(UpdateFileService.name);
    private readonly directusUrl = process.env.DIRECTUS_BASE_URL;
    private readonly items = "";

    constructor(private readonly authService: AuthService,
        private readonly studentService: DirectusStudentsService,
    ) {

    }

    async updateFileFolder(studentId: string, fileId: string, folderName: string) {
        const fileIdUrlEndpoint = "/asset/" + fileId;

    }
}
