import fs from "fs"
import path from "path"
import { TMP_FOLDER, UPLOAD_FOLDER, UPLOAD_FOLDER_INGREDIENTS } from "../config/upload";


export class DiskStorage {


  async save(file: string) {
    console.log(TMP_FOLDER);
    
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOAD_FOLDER, file)
    )

    return file
  }

  async saveIngredientsFile(file: string) {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOAD_FOLDER_INGREDIENTS, file)
    )

    return file
  }

  async delete(file: string) {
    const filePath = path.resolve(UPLOAD_FOLDER, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }

  async deleteIngredientsFile(file: string) {
    const filePath = path.resolve(UPLOAD_FOLDER_INGREDIENTS, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}
