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

  it('works with buffers', function * () {
    const fileId = yield this.fs.addFile(new Buffer('this is the content'))
    fileId.should.be.a.String()
  })

  it('works with streams')

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

describe('FileStore.getFiles', function () {
  it('return an empty list if none inserted', function * () {
    const ids = yield this.fs.listFiles()
    ids.should.be.an.Array()
    ids.length.should.be.equal(0)
  })

  it('return a valid list of files', function * () {
    const fileId = yield this.fs.addFile(__filename)
    const ids = yield this.fs.listFiles()
    ids.should.be.an.Array()
    ids.length.should.be.equal(1)
    ids[0].should.be.equal(fileId)
  })
})

describe('FileStore.getFile', function () {
  beforeEach(function * () {
    this.fileId = yield this.fs.addFile(__filename)
  })

  it('return a valid buffer if fileId exists', function * () {
    const buffer = yield this.fs.getFile(this.fileId)
    buffer.should.be.an.instanceOf(Buffer)
  })

  it('throw if fileId does not exist', function * () {
    let err = null
    try {
      yield this.fs.getFile('78923')
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
