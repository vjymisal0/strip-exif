'use strict';
let modulePromise;
const load = () => (modulePromise ??= import('./index.js'));

exports.readExif = (...args) => load().then((module) => module.readExif(...args));
exports.stripExif = (...args) => load().then((module) => module.stripExif(...args));
exports.hasGpsData = (...args) => load().then((module) => module.hasGpsData(...args));
