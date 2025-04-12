let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enable ESLint checks during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript type checking during builds
    ignoreBuildErrors: false,
  },
  images: {
    // Enable Next.js image optimization for production
    unoptimized: false,
    domains: [
      'w8d9q6vsv9.ufs.sh',
      'i0.wp.com',
      '149667878.v2.pressablecdn.com',
      'placehold.co',
      'via.placeholder.com'
    ],
  },
  experimental: {
    // Keep performance-enhancing features
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
