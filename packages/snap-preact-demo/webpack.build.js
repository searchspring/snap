const modern = require('./snap/webpack.modern.js');
const modernTemplates = require('./templates/webpack.modern.js');
const universal = require('./snap/webpack.universal.js');
const universalTemplates = require('./templates/webpack.universal.js');

module.exports = [modern, modernTemplates, universal, universalTemplates];
