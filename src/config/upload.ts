import path from "path"
import crypto from "crypto"
import multer from "multer"

const TMP_FOLDER_DEV = path.resolve(__dirname, "..", "..", "tmp")
const TMP_FOLDER_PRODUCTION = path.resolve(__dirname, "..", "tmp")

export const TMP_FOLDER = path.resolve(process.env.NODE_ENV !== 'production'
  ? TMP_FOLDER_DEV : TMP_FOLDER_PRODUCTION)
export const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads")
export const UPLOAD_FOLDER_INGREDIENTS = path.resolve( 
  TMP_FOLDER,
  "uploads",
  "ingredients"
)


export const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(_, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex")
      const filename = `${fileHash}-${file.originalname}`

      callback(null, filename)
    },
  }),
}
