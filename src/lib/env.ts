// 集中管理 GitHub 数据源配置。
// Cloudflare Workers Builds 不会把 wrangler.toml 的 [vars] 注入运行时，
// 因此这里提供兜底值，保证 env 缺失时站点仍指向本项目自己的 fork。
export const GITHUB_OWNER = process.env.GITHUB_OWNER || 'zwjdujin'
export const GITHUB_REPO = process.env.GITHUB_REPO || 'NavSphere'
export const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'
