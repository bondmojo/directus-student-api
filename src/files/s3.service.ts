import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { PassThrough } from 'stream';
import * as archiver from 'archiver';
import { DirectusAPIService } from '../apis/du-api-request.service';
import { Upload } from '@aws-sdk/lib-storage';



@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;
    private accessKeyId = process.env.S3_ACCESS_KEY;
    private secretAccessKey = process.env.S3_SECRET_KEY;
    private logger = new Logger(S3Service.name);

    constructor(private readonly directusRequestService: DirectusAPIService) {
        this.s3Client = new S3Client({
            region: 'ap-southeast-1', // e.g., 'us-east-1'
            credentials: {
                accessKeyId: this.accessKeyId,  //process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: this.secretAccessKey // process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        this.bucketName = 'printersw-dev';
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileKey = `${uuidv4()}-${file.originalname}`;

        const params = {
            Bucket: this.bucketName,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);

        return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
    }

    async uploadStudentPhotosToS3(students: any[], schoolId: string) {

        const passThroughStream = new PassThrough();
        const filePath = `${uuidv4()}-${schoolId}-photos`;

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(passThroughStream);

        for (const student of students) {
            const fileId = student.student_photo; // Assuming 'student_photo' holds the file ID
            if (fileId) {
                // Fetch the file from Directus
                this.logger.log("fetching file id=" + fileId);
                const fileResponse = await this.directusRequestService.getRequest(`/assets/${fileId}`, 'downloadStudentPhotos', { "key": "responseType", "value": "stream" });

                archive.append(fileResponse.data, {
                    name: `student_${fileId}_${student.id}_photo.jpg`, // Customize the file name
                });
                this.logger.log("archived" + fileId);

            }
        }
        this.logger.log("finalizing archive");
        archive.finalize();

        // Use the Upload class for streaming the file to S3
        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: this.bucketName,
                Key: filePath,
                Body: passThroughStream,
                ContentType: 'application/zip',
            },
        });

        /*const uploadParams = {
            Bucket: this.bucketName,
            Key: filePath,
            Body: passThroughStream,
            ContentType: "application/zip",
        };*/
        try {
            const s3FilePath = `https://${this.bucketName}.s3.amazonaws.com/${filePath}`;
            const result = await upload.done();
            //await this.s3Client.send(new PutObjectCommand(uploadParams));
            this.logger.log('S3 Zip Upload complete to = ' + s3FilePath + " with result=" + JSON.stringify(result));
            return s3FilePath;

        } catch (err) {
            this.logger.error('Error uploading zip file to s3:', err);
            throw err;
        }

    }
}
