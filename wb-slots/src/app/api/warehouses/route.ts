import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const createWarehouseSchema = z.object({
  warehouseId: z.number().int().positive(),
  warehouseName: z.string().min(1),
  enabled: z.boolean().default(true),
  boxAllowed: z.boolean().default(true),
  monopalletAllowed: z.boolean().default(true),
  supersafeAllowed: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const warehouses = await prisma.warehousePref.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { warehouses },
    });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createWarehouseSchema.parse(body);

    // Check if warehouse already exists for this user
    const existingWarehouse = await prisma.warehousePref.findUnique({
      where: {
        userId_warehouseId: {
          userId: user.id,
          warehouseId: validatedData.warehouseId,
        },
      },
    });

    if (existingWarehouse) {
      return NextResponse.json(
        { success: false, error: 'Склад уже добавлен' },
        { status: 409 }
      );
    }

    const warehouse = await prisma.warehousePref.create({
      data: {
        userId: user.id,
        warehouseId: validatedData.warehouseId,
        warehouseName: validatedData.warehouseName,
        enabled: validatedData.enabled,
        boxAllowed: validatedData.boxAllowed,
        monopalletAllowed: validatedData.monopalletAllowed,
        supersafeAllowed: validatedData.supersafeAllowed,
      },
    });

    return NextResponse.json({
      success: true,
      data: { warehouse },
    });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    
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