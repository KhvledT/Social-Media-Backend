import multer from "multer";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { StorageApproachEnum } from "../../enums/multer.enum.js";
import { allowedFileFormats, fileFilter } from "./multer.validation.js";

function cloudFileUpload({
  storageApproach = StorageApproachEnum.Memory,
  allowedFormats = allowedFileFormats.img,
  fileSize = 5,
}: {
  storageApproach?: StorageApproachEnum;
  allowedFormats?: string[];
  fileSize?: number;
}) {
  const storage =
    storageApproach === StorageApproachEnum.Memory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, tmpdir());
          },
          filename: (req, file, cb) => {
            cb(null, `${randomUUID()}-${file.originalname}`);
          },
        });

  return multer({
    storage,
    fileFilter: fileFilter(allowedFileFormats.img),
    limits: { fieldSize: fileSize * 1024 * 1024 },
  });
}

export default cloudFileUpload;
