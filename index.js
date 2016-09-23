'use strict'

const crypto = require('co-crypto')
const fs = require('fs')
const fse = require('co-fs-extra')
const pjoin = require('path').join

class FileStore {
  constructor (opts) {
    opts = Object.assign({}, opts)
    if (!opts.baseDir) throw Error('`baseDir` has to be specified')
    this._baseDir = opts.baseDir
  }

  // Get the internal path for a given fileId
  _filePath (fileId) {
    return pjoin(this._baseDir, fileId)
  }

  // Return an id for later access to file
  * addFile (path) {
    const results = yield [
      crypto.randomBytes(16),
      fse.ensureDir(this._baseDir)
    ]
    const fileId = results[0].toString('hex')
    yield fse.copy(path, this._filePath(fileId))
    return fileId
  }

  * getFileStream (fileId) {
    const path = this._filePath(fileId)
    fs.statSync(path)
    return fs.createReadStream(path)
  }
}

module.exports = FileStore
