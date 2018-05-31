const fs = require('fs-extra');
const path = require('path');
const babel = require('babel-core');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

fs.emptyDirSync(resolveApp('lib'));