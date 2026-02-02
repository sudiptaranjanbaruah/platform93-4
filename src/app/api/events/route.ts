import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                date: 'asc',
            },
        });

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Get events error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
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

        const { title, description, date, location } = await request.json();

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
            },
        });

        return NextResponse.json({ event, success: true });
    } catch (error) {
        console.error('Create event error:', error);
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
