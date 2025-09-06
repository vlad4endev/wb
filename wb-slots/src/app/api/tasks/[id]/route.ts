import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { updateTaskSchema } from '@/lib/validation';
import { TaskScheduler } from '@/lib/scheduler';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const taskId = params.id;

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
      include: {
        runs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { runs: true },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const taskId = params.id;
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: validatedData,
      include: {
        _count: {
          select: { runs: true },
        },
      },
    });

    // Update scheduler
    const scheduler = TaskScheduler.getInstance();
    await scheduler.updateTask(task);

    return NextResponse.json({
      success: true,
      data: { task },
      message: 'Task updated successfully',
    });
  } catch (error) {
    console.error('Update task error:', error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const taskId = params.id;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Cancel scheduled task
    const scheduler = TaskScheduler.getInstance();
    await scheduler.cancelTask(taskId);

    // Delete task (cascade will handle related records)
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
