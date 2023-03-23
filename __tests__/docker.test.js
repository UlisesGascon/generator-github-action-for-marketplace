'use strict'
const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('generator-github-action-for-marketplace: Docker', () => {
  const name = 'My Docker Action'
  const description = 'My Docker Action Description'
  const type = 'docker'

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

  it('Include Specific Docker related files', () => {
    assert.file(['Dockerfile'])
    assert.file(['entrypoint.sh'])
    assert.file(['README.md'])
    assert.file(['action.yml'])
  })

  it('Include Customized Docker related files', () => {
    assert.fileContent('README.md', description)
    assert.fileContent('README.md', name)
    assert.fileContent('action.yml', description)
    assert.fileContent('action.yml', name)
  })
})
