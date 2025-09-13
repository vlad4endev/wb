import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  { params }: { params: Promise<{ id: string }> }
=======
  { params }: { params: { id: string } }
>>>>>>> Stashed changes
=======
  { params }: { params: { id: string } }
>>>>>>> Stashed changes
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const { id: taskId } = await params;
=======
    const taskId = params.id;
>>>>>>> Stashed changes
=======
    const taskId = params.id;
>>>>>>> Stashed changes

    // Находим задачу
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Останавливаем задачу
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { enabled: false }
    });

    return NextResponse.json({
      success: true,
      message: 'Task stopped successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error stopping task:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
