import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    BadRequestException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dropbox } from 'dropbox';
import axios from 'axios';
import * as cron from 'node-cron';

@Injectable()
export class DropboxStorageService {
    private dbx: Dropbox;
    private accessToken: string;
    private refreshToken: string;
    private clientId: string;
    private clientSecret: string;
    private appFolder: string;
    private tokenExpiresAt: number;

    constructor(private readonly configService: ConfigService) {
        this.accessToken = this.configService.get<string>('DROPBOX_ACCESS_TOKEN');
        this.refreshToken = this.configService.get<string>('DROPBOX_REFRESH_TOKEN');
        this.clientId = this.configService.get<string>('DROPBOX_CLIENT_ID');
        this.clientSecret = this.configService.get<string>('DROPBOX_CLIENT_SECRET');
        this.appFolder = this.configService.get<string>('DROPBOX_PAGES_IMAGES_FOLDER') || '';

        this.dbx = new Dropbox({ accessToken: this.accessToken, fetch: fetch });
        this.tokenExpiresAt = Date.now() + 14400000;

        // 🔄 Force token refresh every 1 hour to prevent Dropbox 24-hour expiration
        cron.schedule('0 * * * *', async () => {
            console.log('⏳ Forced token refresh to keep the session alive');
            await this.refreshAccessToken();
        });
    }

    /**
     * Ensures the token is refreshed only if expired
     */
    async ensureValidToken() {
        if (!this.tokenExpiresAt) {
            console.warn('⚠️ Warning: tokenExpiresAt is not set. Forcing token refresh...');
            await this.refreshAccessToken();
            return;
        }

        console.log(`🕒 Current Time: ${new Date().toISOString()}`);
        console.log(`🔒 Token Expires At: ${new Date(this.tokenExpiresAt).toISOString()}`);

        if (Date.now() >= this.tokenExpiresAt) {
            console.log('🔄 Token has expired. Refreshing now...');
            await this.refreshAccessToken();
        } else {
            console.log('✅ Access token is still valid.');
        }
    }


    /**
     * Refreshes the Dropbox access token using the refresh token
     */
    async refreshAccessToken() {
        try {
            const response = await axios.post('https://api.dropbox.com/oauth2/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                },
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiresAt = Date.now() + 14400000; // 4 hours validity
            this.dbx = new Dropbox({ accessToken: this.accessToken, fetch: fetch });
            
            console.log('✅ Dropbox Token Refreshed Successfully');
        } catch (error) {
            throw new InternalServerErrorException('❌ Failed to refresh Dropbox token');
        }
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