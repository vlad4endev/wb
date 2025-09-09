import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { warehouseIds } = await request.json();

    if (!warehouseIds || !Array.isArray(warehouseIds) || warehouseIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Warehouse IDs array is required' },
        { status: 400 }
      );
    }

    // Получаем информацию о складах
    const warehouses = await prisma.warehouse.findMany({
      where: { id: { in: warehouseIds } },
      select: { id: true, name: true, isActive: true },
    });

    if (warehouses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No warehouses found with provided IDs' },
        { status: 404 }
      );
    }

    // Добавляем склады в пользовательские предпочтения
    const createdPrefs = [];
    for (const warehouse of warehouses) {
      try {
        const existingPref = await prisma.warehousePref.findUnique({
          where: {
            userId_warehouseId: {
              userId: user.id,
              warehouseId: warehouse.id,
            },
          },
        });

        if (!existingPref) {
          const pref = await prisma.warehousePref.create({
            data: {
              userId: user.id,
              warehouseId: warehouse.id,
              warehouseName: warehouse.name,
              enabled: true,
              boxAllowed: true,
              monopalletAllowed: true,
              supersafeAllowed: true,
            },
          });
          createdPrefs.push(pref);
        }
      } catch (error) {
        console.error(`Error creating warehouse preference for ${warehouse.id}:`, error);
        // Продолжаем с другими складами
      }
    }

    return NextResponse.json({
      success: true,
      data: { 
        addedWarehouses: createdPrefs.length,
        warehouses: warehouses.map(w => ({ id: w.id, name: w.name }))
      },
      message: `Добавлено ${createdPrefs.length} складов в ваш список`,
    });
  } catch (error) {
    console.error('Add warehouses to user error:', error);
    
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