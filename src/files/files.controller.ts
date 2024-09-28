import { Body, Controller, Logger, Post, Get, Param, Query } from '@nestjs/common';
import { AuthService } from '../apis/auth.service';
import { FileService } from './files.service';
import { DirectusStudentsService } from 'src/students/directus-students.service';
import { DirectusAPIService } from 'src/apis/du-api-request.service';

@Controller('directus-files')
export class FilesController {
    private readonly logger = new Logger(FilesController.name);

    constructor(private readonly filesService: FileService,
        private readonly studentService: DirectusStudentsService,
        private readonly directusAPIService: DirectusAPIService
    ) {
    }

    @Get('file-details/:fileId')
    async getFileDetails(@Param('fileId') fileId: string) {
        this.logger.log("file ID: " + fileId);
        const fileEndpoint = '/files/' + fileId;
        return await this.directusAPIService.getRequest(fileEndpoint, 'Get-File-API');
    }

    @Post('createFolders')
    async createFolders(@Body() body) {
        this.logger.log("new school created: createFolders: " + JSON.stringify(body));
        if (body.parent) {
            return {
                status: false,
                message: "Folder is not at root level"
            }
        }
        return {};
        return await this.filesService.populateFolderNames();
    }

    @Post('refreshFolders')
    async refreshFolders(@Body() body) {
        this.logger.log("new folder created: " + JSON.stringify(body));
        if (body.parent) {
            return {
                status: false,
                message: "Folder is not at root level"
            }
        }
        return await this.filesService.populateFolderNames();
    }

    @Post('move-file-to-folder')
    async moveFiletoFolder(@Body() triggeredStudentData) {
        const ev = JSON.stringify(triggeredStudentData);
        this.logger.log(ev);

        const event = triggeredStudentData.event;
        const payload = triggeredStudentData.payload;
        let studentId: string;
        let studentDetails: any;
        this.logger.log("payload" + JSON.stringify(payload));

        if (!payload.student_photo) {
            this.logger.log("No Photo Found.");
            return {
                status: false,
                message: "No Photo Found."
            }
        }

        if (event === "students.items.update") {
            studentId = triggeredStudentData.keys;

        }
        else if (event === "students.items.create") {
            studentId = triggeredStudentData.key;
        }

        if (!studentId) {
            this.logger.log("No Student ID Found.");
            return {
                status: false,
                message: "No Student ID Found."
            }
        }

        this.logger.log("student id = " + studentId);
        studentDetails = await this.studentService.fetchStudentDataById(studentId);
        this.logger.log(JSON.stringify(studentDetails));

        const schoolName = studentDetails.school.school_name;
        const fileId = studentDetails.student_photo.id;
        const oldFolderId = studentDetails.student_photo.folder;

        this.logger.log("Old Folder Id = " + oldFolderId);
        const newFolderId = this.filesService.getFolderIdbyName(schoolName);
        this.logger.log("New Folder Id = " + newFolderId);
        if (!newFolderId) {
            return {
                status: false,
                message: `Folder with School Name: ${schoolName} does not exist.`
            }
        }

        return await this.filesService.updateFileFolder(fileId, newFolderId);

    }


}