import { AbstractFileService, Logger } from "@medusajs/medusa";
import {
  DeleteFileType,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "@medusajs/types";
import { put, del, getDownloadUrl } from "@vercel/blob";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { PassThrough, Readable } from "stream";
import fetch from "cross-fetch";

export const config = {
  runtime: 'edge',
};

class VercelFileService extends AbstractFileService {
  protected readonly logger: Logger;
  protected readonly bucket: string;

  constructor(container: any, config: Record<string, unknown> | undefined) {
    super(container);
    const bucket: string =
      (config?.bucketName as string) || process.env.BUCKET_NAME || '';
    this.logger = container.logger as Logger;
    this.bucket = bucket;
  }

  async upload(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    try {
      const {pathname, downloadUrl} = await put(`assets/${randomUUID()}.${fileData.originalname.split(".").pop()}`,
          createReadStream(fileData.path),
          { access: 'public' });
      return {
        key: pathname,
        url: downloadUrl,
      };
    }
    catch (error)
    {
      this.logger.error(error);
      throw new Error("Error uploading file");
    }
  }

  async uploadProtected(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    throw new Error("Not Implemented");
  }

  async delete(fileData: DeleteFileType): Promise<void> {
    try {
      await del([fileData.fileKey],  {});
    }
    catch (error)
    {
      this.logger.error(error);
      throw new Error("Error deleting file");
    }
  }

  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    const pass = new PassThrough();

    if(fileData.isPrivate)
    {
      throw new Error("Not Implemented")
    }

    const key = `public/${randomUUID()}.${fileData.ext}`;

    const promise = put(key, pass, {
      access: "public",
      contentType: fileData.contentType as string});

    return {
      writeStream: pass,
      promise,
      url: getDownloadUrl(key),
      fileKey: key,
    };
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    const downloadUrl = getDownloadUrl(fileData.fileKey)

    try {
      const res = await fetch(downloadUrl, {method: "GET", }).then(res => res.blob())
      return res.stream();
    }
    catch(error){
      this.logger.error("ERROR GETTING file", error);
      throw new Error("Error getting download stream");
    }
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    throw new Error("Not Implemented");
  }
}

export default VercelFileService;
