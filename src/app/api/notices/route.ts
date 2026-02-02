import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ notices });
    } catch (error) {
        console.error('Get notices error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notices' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        const { title, content } = await request.json();

        const notice = await prisma.notice.create({
            data: {
                title,
                content,
            },
        });

        return NextResponse.json({ notice, success: true });
    } catch (error) {
        console.error('Create notice error:', error);
        return NextResponse.json(
            { error: 'Failed to create notice' },
            { status: 500 }
        );
    }
}
