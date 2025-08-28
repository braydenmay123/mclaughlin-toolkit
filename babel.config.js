module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transforms ESM-only `import.meta` so the bundle runs as a classic script
      ['transform-import-meta', { useRelativePath: true }],
    ],
  };
};
