import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Get basic stats
    const [
      totalTasks,
      activeTasks,
      totalRuns,
      successfulRuns,
      supplySnapshots,
    ] = await Promise.all([
      prisma.task.count({
        where: { userId: user.id },
      }),
      prisma.task.count({
        where: { userId: user.id, enabled: true },
      }),
      prisma.run.count({
        where: { userId: user.id },
      }),
      prisma.run.count({
        where: { userId: user.id, status: 'SUCCESS' },
      }),
      prisma.supplySnapshot.count({
        where: { userId: user.id },
      }),
    ]);

    // Calculate found slots from recent runs
    const recentRuns = await prisma.run.findMany({
      where: {
        userId: user.id,
        status: 'SUCCESS',
        summary: {
          not: null,
        },
      },
      select: {
        summary: true,
      },
      take: 100, // Last 100 successful runs
    });

    let foundSlots = 0;
    for (const run of recentRuns) {
      if (run.summary && typeof run.summary === 'object' && 'foundSlots' in run.summary) {
        foundSlots += (run.summary as any).foundSlots || 0;
      }
    }

    const stats = {
      totalTasks,
      activeTasks,
      totalRuns,
      successfulRuns,
      foundSlots,
      supplySnapshots,
      successRate: totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
