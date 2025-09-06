import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createTaskSchema, paginationSchema } from '@/lib/validation';
import { TaskScheduler } from '@/lib/scheduler';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        runs: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { runs: true },
        },
      },
    });

    const total = await prisma.task.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    // Create task
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
      include: {
        _count: {
          select: { runs: true },
        },
      },
    });

    // Schedule task if it has a cron expression and is enabled
    if (task.scheduleCron && task.enabled) {
      const scheduler = TaskScheduler.getInstance();
      await scheduler.scheduleTask(task);
    }

    return NextResponse.json({
      success: true,
      data: { task },
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Create task error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
