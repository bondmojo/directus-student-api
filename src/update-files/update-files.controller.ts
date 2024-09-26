import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UpdateFileService } from './update-files.service';

@Controller('directus-files')
export class UpdateFilesController {
    private readonly logger = new Logger(UpdateFilesController.name);

    constructor(private readonly updateFilesService: UpdateFileService,
        private readonly authService: AuthService
    ) {
    }
    @Post('updateFileParent')
    async downloadStudentsZip(@Body() triggeredStudentData) {
        const ev = JSON.stringify(triggeredStudentData);
        this.logger.log(ev);

        const event = triggeredStudentData.event;
        const payload = triggeredStudentData.payload;
        let key;
        this.logger.log(payload);

        if (event === "students.items.update") {
            key = triggeredStudentData.keys;
            this.logger.log("student id = " + key);
        }
        else if (event === "students.items.create") {
            key = triggeredStudentData.key;
            this.logger.log("student id = " + key);
        }

        if (!key) {
            this.logger.log("No Student ID Found.");
            return {
                status: false,
                message: "No Student ID Found."
            }
        }
        if (!payload.student_photo) {
            this.logger.log("No Photo Found.");
            return {
                status: false,
                message: "No Photo Found."
            }
        }



        //this.updateFilesService.updateFileFolder(request.studentId, request.fileId, request.parentFolder);
        return {};
    }


}