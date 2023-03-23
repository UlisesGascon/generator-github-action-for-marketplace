'use strict'
const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('generator-github-action-for-marketplace: JavaScript', () => {
  const name = 'My JavaScript Action'
  const description = 'My JavaScript Action Description'
  const type = 'nodejs'

  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      name,
      description,
      type
    })
  })

  it('Include Common Files', () => {
    assert.file(['.gitignore'])
  })

  it('Include Specific JS related files', () => {
    assert.file(['package.json'])
    assert.file(['.nvmrc'])
    assert.file(['README.md'])
    assert.file(['jest.config.js'])
    assert.file(['action.yml'])
    // SRC Folder
    assert.file(['src/index.js'])
    assert.file(['src/wait.js'])
    // TEST Folder
    assert.file(['__tests__/index.test.js'])
    // workflows
    assert.file(['.github/workflows/main.yml'])
  })

  it('Include Customized JS related files', () => {
    assert.fileContent('README.md', description)
    assert.fileContent('README.md', name)
    assert.fileContent('action.yml', description)
    assert.fileContent('action.yml', name)
    assert.fileContent('package.json', description)
    assert.fileContent('package.json', name)
  })
})
