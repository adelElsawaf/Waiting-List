import { Injectable, ConflictException, InternalServerErrorException, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dropbox, DropboxResponseError } from 'dropbox';

@Injectable()
export class DropboxStorageService {
    private dbx: Dropbox;
    private appFolder: string;

    constructor(configService: ConfigService) {
        this.dbx = new Dropbox({ accessToken: configService.get<string>('DROPBOX_ACCESS_TOKEN') });
        this.appFolder = configService.get<string>('DROPBOX_PAGES_IMAGES_FOLDER') || '';
    }

    /**
     * Uploads a file to Dropbox and returns the direct shared link.
     */
    async upload(file: Express.Multer.File): Promise<string> {
        if (!file || !file.originalname) {
            throw new BadRequestException('No file provided or file is invalid.');
        }
        const fileOriginalName = await this.appendTimeToFileName(file.originalname);
        const fileName = `/${this.appFolder}/${fileOriginalName}`.replace(/\/+/g, '/');

        try {
            // Upload the file to Dropbox
            await this.dbx.filesUpload({
                path: fileName,
                contents: file.buffer,
                mode: { '.tag': 'add' }, // 'add' mode throws conflict if file exists
            });

            // Create or get shared link
            const sharedLink = await this.createOrGetSharedLink(fileName);
            const directLink = this.cleanDropboxUrl(sharedLink);

            return directLink;
        } catch (error: any) {

            if (error?.status == 409) {
                throw new ConflictException(`File "${file.originalname}" already exists in Dropbox.`);
            } else if (error?.status === 400) {
                throw new BadRequestException('Bad request to Dropbox API. Please check file parameters.');
            } else if (error?.status === 401) {
                throw new UnauthorizedException('Dropbox access token is invalid or expired.');
            } else if (error?.status === 500) {
                throw new InternalServerErrorException('Dropbox server error. Please try again later.');
            }

            // Fallback for unknown errors
            throw new InternalServerErrorException(
                `Dropbox Upload Error: ${error.message || 'An unexpected error occurred during upload.'}`
            );
        }
    }

    async appendTimeToFileName(fileName: string): Promise<string> {
        const timestamp = Date.now(); // Get current timestamp
        const fileExtension = fileName.substring(fileName.lastIndexOf(".")) || ""; // Extract file extension
        const baseName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName; // Extract file name without extension

        return `${baseName}-${timestamp}${fileExtension}`; // Append timestamp to filename
    }


    /**
     * Cleans the Dropbox shared URL to ensure it uses ?raw=1 for direct access
     */
    private cleanDropboxUrl(url: string): string {
        if (url.includes('?dl=0')) {
            return url.replace('?dl=0', '?raw=1');
        } else if (url.includes('&dl=0')) {
            return url.replace('&dl=0', '&raw=1');
        } else if (!url.includes('?raw=1') && !url.includes('&raw=1')) {
            return url.includes('?') ? `${url}&raw=1` : `${url}?raw=1`;
        }
        return url;
    }

    /**
     * Creates a new shared link or returns an existing one.
     */
    private async createOrGetSharedLink(filePath: string): Promise<string> {
        try {
            const sharedLink = await this.dbx.sharingCreateSharedLinkWithSettings({
                path: filePath,
            });
            return sharedLink.result.url;
        } catch (error: any) {
            // Log full Dropbox API error for better debugging
            if (error?.status === 409) {
                // If link already exists, try fetching it
                const existingLink = await this.getExistingSharedLink(filePath);
                if (existingLink) {
                    return existingLink;
                } else {
                    throw new InternalServerErrorException('Failed to retrieve existing shared link after conflict.');
                }
            } else if (error?.status === 400) {
                throw new BadRequestException(`Dropbox API Bad Request: ${error.error?.error_summary || 'No details provided.'}`);
            } else if (error?.status === 401) {
                throw new InternalServerErrorException('Unauthorized: Invalid Dropbox access token.');
            } else if (error?.status === 500) {
                throw new InternalServerErrorException('Dropbox server error. Please try again later.');
            }

            // Catch-all for unknown errors
            throw new InternalServerErrorException(`Shared Link Error: ${error.message || 'Unknown error occurred.'}`);
        }
    }


    /**
     * Retrieves an existing shared link if available.
     */
    private async getExistingSharedLink(filePath: string): Promise<string | null> {
        try {
            const existingLinks = await this.dbx.sharingListSharedLinks({
                path: filePath,
                direct_only: true,
            });

            if (existingLinks.result.links.length > 0) {
                return existingLinks.result.links[0].url;
            }
            return null;
        } catch (error: any) {
            throw new InternalServerErrorException(`Error retrieving existing shared link: ${error.message}`);
        }
    }
}
