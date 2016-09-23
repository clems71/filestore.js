/* global beforeEach describe it*/

'use strict'

const fs = require('fs')
const fse = require('co-fs-extra')

const FileStore = require('..')

beforeEach(function * () {
  const baseDir = `${__dirname}/filestore`

  yield fse.emptyDir(baseDir)
  this.fs = new FileStore({ baseDir })
})

describe('FileStore.addFile', function () {
  it('returns a valid fileId', function * () {
    const fileId = yield this.fs.addFile(__filename)
    fileId.should.be.a.String()
  })

  it('throw if source file does not exist', function * () {
    let err = null
    try {
      yield this.fs.addFile('/unknown/<path!>')
    } catch (e) {
      err = e
    }
    err.should.be.an.Error()
  })
})

describe('FileStore.getFileStream', function () {
  beforeEach(function * () {
    this.fileId = yield this.fs.addFile(__filename)
  })

  it('return a valid stream if fileId exists', function * () {
    const stream = yield this.fs.getFileStream(this.fileId)
    stream.should.be.an.instanceOf(fs.ReadStream)
  })

  it('throw if fileId does not exist', function * () {
    let err = null
    try {
      yield this.fs.getFileStream('78923')
    } catch (e) {
      err = e
    }
    err.should.be.an.Error()
  })
})