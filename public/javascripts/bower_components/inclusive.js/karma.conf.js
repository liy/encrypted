module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],

    colors: true,

    reporters: ['dots', 'notify'],

    // logLevel: config.LOG_DEBUG,

    browsers: ['Chrome', 'Firefox', 'IE']
    // browsers: ['Chrome']
    // browsers: ['Firefox']
    // browsers: ['IE']
  });
};