import { AuthenticationClient, authentication, createDirectus, rest, readItems } from '@directus/sdk';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { DirectusAPIService } from '../apis/du-api-request.service';
import { DirectusStudentsService } from '../students/directus-students.service';

@Injectable()
export class FileService {

    private readonly logger = new Logger(FileService.name);
    private readonly directusUrl = process.env.DIRECTUS_BASE_URL;
    private readonly items = "";
    private folderStore: Record<string, string> = {}; // Key-value store


    constructor(private readonly apiService: DirectusAPIService
    ) {

    }

    async getFileDetails(fileId: string) {
        const fileIdUrlEndpoint = "/files/" + fileId;
        return await this.apiService.getRequest(fileIdUrlEndpoint, "file details");

    }

    async updateFileFolder(fileId: string, folderId: string) {
        const fileIdUrlEndpoint = "/files/" + fileId;
        try {
            return await this.apiService.patchRequest(fileIdUrlEndpoint, "updating folder", { "folder": folderId });
        }
        catch (error) {
            this.logger.error(error.message);
        }
    }

    onModuleInit() {
        this.populateFolderNames();
    }

    async populateFolderNames(): Promise<Record<string, string>> {

        const folderEndpoint = "/folders";
        const response = await this.apiService.getRequest(folderEndpoint, 'get folders');

        //this.folderList = response.map((item) => item.name);
        response.forEach((item) => {
            this.folderStore[item.name] = (item.id);
        });
        this.logger.log(JSON.stringify(this.folderStore));
        return this.folderStore;
    }

    public getFolderList(): Record<string, string> {
        return this.folderStore;
    }

    public getFolderIdbyName(folderName: string): string {
        return this.folderStore[folderName];
    }

}
