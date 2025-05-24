import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// スケジュールの取得
export async function GET() {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('スケジュールの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'スケジュールの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// スケジュールの追加
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const schedule = await prisma.schedule.create({
      data: {
        ...body,
        userId: user.id
      },
    });
    return NextResponse.json(schedule);
  } catch (error) {
    console.error('スケジュールの追加に失敗しました:', error);
    return NextResponse.json(
      { error: 'スケジュールの追加に失敗しました' },
      { status: 500 }
    );
  }
} 