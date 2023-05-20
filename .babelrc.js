module.exports = function (api) {
  api.cache(true);
  api.cache.forever();

  const plugins = ['macros'];
  return {
    plugins,
  };
};
