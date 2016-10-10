'use strict'

const crypto = require('co-crypto')
const fs = require('fs')
const cofs = require('co-fs')
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
  // f can be a path to file, a buffer or a Stream
  * addFile (f) {
    const results = yield [
      crypto.randomBytes(16),
      fse.ensureDir(this._baseDir)
    ]
    const fileId = results[0].toString('hex')
    const filePath = this._filePath(fileId)

    if (f instanceof Buffer) {
      yield cofs.writeFile(filePath, f)
    } else if (typeof f === 'string') {
      yield fse.copy(f, filePath)
    } else {
      throw Error('unsupported argument type')
    }
    return fileId
  }

  * listFiles () {
    return yield cofs.readdir(this._baseDir)
  }

  * getFile (fileId) {
    const path = this._filePath(fileId)
    return (yield cofs.readFile(path))
  }

  * getFileStream (fileId) {
    const path = this._filePath(fileId)
    yield cofs.stat(path)
    return fs.createReadStream(path)
  }
}

module.exports = FileStore
