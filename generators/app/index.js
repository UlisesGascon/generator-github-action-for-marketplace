'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const slugify = require('slugify')

const fs = require('fs')
const path = require('path')

module.exports = class extends Generator {
  prompting () {
    this.log(
      yosay(
        `Welcome to the luminous ${chalk.red(
          'generator-github-action-for-marketplace'
        )} generator!`
      )
    )

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description'
      },
      {
        type: 'list',
        name: 'type',
        message: 'What do you want to build?',
        choices: [
          {
            name: 'Docker GitHub Action',
            value: 'docker'
          },
          {
            name: 'JavaScript GitHub Action',
            value: 'js'
          }
        ],
        default: 'js'
      },
      {
        type: 'confirm',
        name: 'includeQuickStart',
        message:
          'Do you want to start the project after the generation (format, lint, build..)?',
        default: true,
        when: answers => answers.type === 'js'
      }
    ]

    return this.prompt(prompts).then(props => {
      this.props = props
      this.props.nameSlug = slugify(this.props.name, { lower: true })
      this.props.filesToSkip = []
    })
  }

  writing () {
    const getFiles = (dirPath, filesPaths = []) => {
      const files = fs.readdirSync(dirPath)

      files.forEach(file => {
        if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
          filesPaths = getFiles(`${dirPath}/${file}`, filesPaths)
        } else {
          filesPaths.push(path.join(dirPath, file))
        }
      })

      return filesPaths
    }

    const copyFiles = (from, to) => {
      const templatesFolder = path.join(__dirname, 'templates', from)
      const files = getFiles(templatesFolder).map(
        file => file.split(`${from}/`)[1]
      )

      files.forEach(file => {
        if (this.props.filesToSkip.includes(`${from}/${file}`)) return
        if (file.endsWith('.ejs')) {
          return this.fs.copy(
            this.templatePath(`./${from}/${file}`),
            this.destinationPath(`${to}/${file.replace(/^_/, '')}`)
          )
        }

        this.fs.copyTpl(
          this.templatePath(`./${from}/${file}`),
          this.destinationPath(`${to}/${file.replace(/^_/, '')}`),
          this.props
        )
      })
    }

    copyFiles('common', '.')

    if (this.props.type === 'docker') {
      copyFiles('docker', '.')
    }

    if (this.props.type === 'js') {
      copyFiles('js-src', 'src')
      copyFiles('js', '.')
      copyFiles('js-tests', '__tests__')
      copyFiles('js-workflows', '.github/workflows')
    }
  }

  install () {
    if (this.props.type === 'js') {
      this.spawnCommandSync('npm', ['i'])
    }
  }

  end () {
    if (this.props.type === 'js' && this.props.includeQuickStart) {
      this.spawnCommandSync('npm', ['run', 'lint:fix'])
      this.spawnCommandSync('npm', ['run', 'format:fix'])
      this.spawnCommandSync('npm', ['run', 'test'])
      this.spawnCommandSync('npm', ['run', 'build'])
    }
  }
}
