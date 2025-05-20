import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
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
  try {
    const { text } = await request.json();
    const lastTodo = await prisma.todo.findFirst({
      orderBy: { position: 'desc' },
    });
    const position = lastTodo ? lastTodo.position + 1 : 0;
    
    const todo = await prisma.todo.create({
      data: {
        text,
        position,
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating todo' }, { status: 500 });
  }
} 