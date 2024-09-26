import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { DirectusStudentsService } from './directus-students.service';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Controller('directus')
export class DirectusStudentsController {
    private readonly logger = new Logger(DirectusStudentsController.name);

    constructor(private readonly directusService: DirectusStudentsService) {
    }
    @Get('download-students')
    async downloadStudentsZip(
        @Query('ids') studentIds: string, // Accept student IDs as query parameter
        @Res() res: Response
    ): Promise<any> {
        // Parse the comma-separated list of IDs into an array
        const ids = studentIds ? studentIds.split(',').map(id => id.trim()) : [];
        this.logger.log("Fetching data for Student ids=" + studentIds);
        if (ids.length === 0) {
            throw new HttpException('No student IDs provided', HttpStatus.BAD_REQUEST);
        }

        // Fetch student data for the provided IDs
        let students;
        try {
            students = await this.directusService.fetchStudentDataByIds(ids);
        }
        catch (error) {
            this.logger.error(error);
            throw new HttpException(
                'Failed to fetch students details from Directus',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        try {
            // Download student photos as ZIP
            const zipFilePath = await this.directusService.downloadStudentPhotos(students);
            // Send the ZIP file as a response
            return res.download(zipFilePath);
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                'Failed to download student photos',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
