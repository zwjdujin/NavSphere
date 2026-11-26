import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { commitFile } from '@/lib/github'
import siteData from '@/navsphere/content/site.json'
import type { SiteInfo } from '@/types/site'

export const runtime = 'edge'

export async function GET() {
  // 直接返回构建时打包的数据，避免运行时调用 GitHub API（边缘出口 IP 匿名额度易被限流）。
  // 管理后台保存数据后会 commit 到仓库并自动触发重新构建，数据随之更新。
  return NextResponse.json(siteData, {
    headers: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate'
    }
  })
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.accessToken) {
      return new Response('Unauthorized', { status: 401 })
    }

    const data: SiteInfo = await request.json()

    // 提交到 GitHub
    await commitFile(
      'src/navsphere/content/site.json',
      JSON.stringify(data, null, 2),
      'Update site configuration',
      session.user.accessToken
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save site data:', error)
    return NextResponse.json(
      { error: 'Failed to save site data' },
      { status: 500 }
    )
  }
} 