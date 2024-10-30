//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextConfig = {
  output: 'export',
  webpack: (/** @type {{ externals: any[]; }} */ config) => {
    config.externals = [
      ...(config.externals || []),
      'bigint',
      'node-gyp-build',
    ];
    return config;
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

module.exports = nextConfig;
