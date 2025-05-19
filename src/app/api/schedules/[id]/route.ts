import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.schedule.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'スケジュールを削除しました' });
  } catch (error) {
    console.error('スケジュールの削除に失敗しました:', error);
    return NextResponse.json(
      { error: 'スケジュールの削除に失敗しました' },
      { status: 500 }
    );
  }
} 