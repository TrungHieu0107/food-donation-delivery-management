// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  // time in seconds of no pages generating during static
  // generation before timing out
  staticPageGenerationTimeout: 1000,
  trailingSlash: true,
  reactStrictMode: false,
  staticPageGenerationTimeout: 3000,
  images: {
    loader: "akamai",
    path: "/",
  },
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
