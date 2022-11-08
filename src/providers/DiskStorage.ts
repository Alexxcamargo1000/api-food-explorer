import fs from 'fs'
import path from 'path'
import { TMP_FOLDER, UPLOAD_FOLDER } from '../config/upload'


class DiskStorage {
  async save(file: string) {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOAD_FOLDER, file)
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
}

module.exports = DiskStorage;