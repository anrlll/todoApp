import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const todo = await prisma.todo.update({
      where: {
        id: parseInt(params.id),
        userId: user.id,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Error updating todo' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    await prisma.todo.delete({
      where: {
        id: parseInt(params.id),
        userId: user.id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Error deleting todo' }, { status: 500 });
  }
} 