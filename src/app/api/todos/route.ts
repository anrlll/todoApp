import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const { text } = await request.json();
    const lastTodo = await prisma.todo.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: { position: 'desc' },
    });
    const position = lastTodo ? lastTodo.position + 1 : 0;
    
    const todo = await prisma.todo.create({
      data: {
        text,
        position,
        userId: user.id,
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating todo' }, { status: 500 });
  }
} 