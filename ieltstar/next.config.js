/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || "",
  },
  webpack: (config) => {
    const projectRoot = path.resolve(__dirname);

    // Fix duplicate React on Windows due to case-insensitive paths (D:\ vs d:\)
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.join(projectRoot, 'node_modules', 'react'),
      'react-dom': path.join(projectRoot, 'node_modules', 'react-dom'),
    };

    // Normalize all module paths to uppercase drive letter on Windows
    // Filesystem reports D:\ so we normalize everything to D:\
    // Prevents webpack from treating D:\ and d:\ as different modules
    config.plugins.push({
      apply(compiler) {
        compiler.hooks.normalModuleFactory.tap('NormalizeDriveLetter', (nmf) => {
          nmf.hooks.beforeResolve.tap('NormalizeDriveLetter', (data) => {
            const fixCase = (s) => {
              if (typeof s === 'string') {
                return s.replace(/^[a-z]:\\/i, (m) => m.toUpperCase());
              }
              return s;
            };
            data.context = fixCase(data.context);
            if (data.request && typeof data.request === 'string' && /^[A-Z]:\\/i.test(data.request)) {
              data.request = fixCase(data.request);
            }
          });
        });
      },
    });

    return config;
  },
}

module.exports = nextConfig
