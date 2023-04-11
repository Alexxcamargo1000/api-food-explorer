import fs from "fs"
import path from "path"


export class DiskStorage {
   private TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")
   private TMP_FOLDER_PROD = path.resolve(__dirname, "..", "tmp")
   private UPLOAD_FOLDER = path.resolve( process.env.NODE_ENV !== 'production' ? this.TMP_FOLDER : this.TMP_FOLDER_PROD , "uploads")
   private UPLOAD_FOLDER_INGREDIENTS = path.resolve(
  this.UPLOAD_FOLDER,
  "ingredients"
)

  async save(file: string) {
    console.log(this.TMP_FOLDER);
    
    await fs.promises.rename(
      path.resolve(this.TMP_FOLDER, file),
      path.resolve(this.UPLOAD_FOLDER, file)
    )

    return file
  }

  async saveIngredientsFile(file: string) {
    await fs.promises.rename(
      path.resolve(this.TMP_FOLDER, file),
      path.resolve(this.UPLOAD_FOLDER_INGREDIENTS, file)
    )

    return file
  }

  async delete(file: string) {
    const filePath = path.resolve(this.UPLOAD_FOLDER, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }

  async deleteIngredientsFile(file: string) {
    const filePath = path.resolve(this.UPLOAD_FOLDER_INGREDIENTS, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}
