import path from "path"
import crypto from "crypto"
import multer from "multer"

export const TMP_FOLDER = path.resolve(__filename, "..", "..", "tmp")
export const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads")
export const UPLOAD_FOLDER_INGREDIENTS = path.resolve(
  TMP_FOLDER,
  "uploads",
  "ingredients"
)


console.log(TMP_FOLDER);


export const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex")
      const filename = `${fileHash}-${file.originalname}`

      callback(null, filename)
    },
  }),
}
