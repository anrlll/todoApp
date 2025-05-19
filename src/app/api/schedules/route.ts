import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// スケジュールの取得
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
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
    const body = await request.json();
    const schedule = await prisma.schedule.create({
      data: body,
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