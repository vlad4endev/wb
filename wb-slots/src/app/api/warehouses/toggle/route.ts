import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { warehouseId, isActive } = await request.json();

    if (!warehouseId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Warehouse ID and isActive status are required' },
        { status: 400 }
      );
    }

    // Обновляем статус склада
    const updatedWarehouse = await prisma.warehouse.update({
      where: { id: warehouseId },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      data: { warehouse: updatedWarehouse },
      message: `Склад ${updatedWarehouse.name} ${isActive ? 'активирован' : 'деактивирован'}`,
    });
  } catch (error) {
    console.error('Toggle warehouse status error:', error);
    
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}