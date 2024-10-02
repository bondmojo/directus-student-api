import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs-extra';
import * as archiver from 'archiver';
import { join } from 'path';
import { DirectusAPIService } from '../apis/du-api-request.service';

@Injectable()
export class DirectusStudentsService {
    private readonly directusUrl = 'http:/localhost:8055'; // Replace with your Directus URL
    //private readonly directusToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg4Nzk4NzgzLTIyNjQtNDM1OC05Nzg2LWMyZWY3ZWNkNDY1YiIsInJvbGUiOiJkMzAzMjQzNi01NzRhLTQ2ZDMtYWU0Mi00NTAzOGJlZmZhZGQiLCJhcHBfYWNjZXNzIjpmYWxzZSwiYWRtaW5fYWNjZXNzIjpmYWxzZSwiaWF0IjoxNzI2NzM0MzA3LCJleHAiOjE3MjY3MzUyMDcsImlzcyI6ImRpcmVjdHVzIn0.DmaH0uZGQmWqBqghxJJ5XtIJZoyHsyF5Mmc6CFDCuJk'
    private readonly logger = new Logger(DirectusStudentsService.name);


    constructor(private readonly directusRequestService: DirectusAPIService) {

    }
    // Function to fetch student data from Directus for specific IDs
    async fetchStudentDataByIds(ids: string[]): Promise<any> {
        try {
            this.logger.log("fetching  data for student ids=" + ids);
            const endpointUrl = "/items/students";

            const paramsObj = {
                filter: {
                    id: { _in: ids },
                },
            };

            const response = await this.directusRequestService.getRequest(endpointUrl, "fetchStudentDataByIds", { "key": "params", "value": paramsObj });
            return response;
            /* const directusToken = await this.directusRequestService.getAccessToken();
            const response = await axios.get(`${this.directusUrl}/items/students`, {
                headers: {
                    Authorization: `Bearer ${directusToken}`,
                },
                params: {
                    filter: {
                        id: { _in: ids },
                    },
                }
            }); */
            this.logger.log("student response received" + JSON.stringify(response.data.data));
            return response.data.data;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                `Failed to fetchStudentDataByIds from Directus`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async fetchStudentDataById(id: string): Promise<any> {
        try {
            return await this.directusRequestService.getRequest(`/items/students/${id}?fields=*.*`, 'students');
        }
        catch (error) {
            this.logger.error(error);
            throw new HttpException(
                `Failed to fetch student details  by id from Directus`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Function to fetch student photos and download them as a ZIP file
    async downloadStudentPhotos(students: any[]): Promise<string> {
        const zipFilePath = join("/Users/mohitjoshi/Downloads/", 'student_photos.zip');
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);

        for (const student of students) {
            const fileId = student.student_photo; // Assuming 'student_photo' holds the file ID
            if (fileId) {
                // Fetch the file from Directus
                console.log("fetching file id=" + fileId);
                /*const directusToken = await this.directusRequestService.getAccessToken();

                const fileResponse = await axios.get(
                    `${this.directusUrl}/assets/${fileId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${directusToken}`,
                        },
                        responseType: 'stream'
                    },
                );*/
                const fileResponse = await this.directusRequestService.getRequest(`/assets/${fileId}`, 'downloadStudentPhotos', { "key": "responseType", "value": "stream" });
                //this.logger.log("response recived" + JSON.stringify(fileResponse.data));

                archive.append(fileResponse.data, {
                    name: `student_${fileId}_${student.id}_photo.jpg`, // Customize the file name
                });
                this.logger.log("archived" + fileId);

            }
        }
        this.logger.log("finalizing");

        await archive.finalize(); // Finalize the archive
        this.logger.log("File path:" + zipFilePath);
        return zipFilePath;
    }
}
