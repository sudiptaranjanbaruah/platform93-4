import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const batch = searchParams.get('batch');

        const where = batch ? { batch } : {};

        const notes = await prisma.note.findMany({
            where,
            include: {
                uploader: {
                    select: {
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ notes });
    } catch (error) {
        console.error('Get notes error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const subject = formData.get('subject') as string;
        const batch = formData.get('batch') as string;
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'File is required' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const filepath = join(process.cwd(), 'public', 'uploads', 'notes', filename);

        await writeFile(filepath, buffer);
        const fileUrl = `/uploads/notes/${filename}`;

        const note = await prisma.note.create({
            data: {
                subject,
                batch,
                fileUrl,
                uploadedBy: user.userId,
            },
            include: {
                uploader: {
                    select: {
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json({ note, success: true });
    } catch (error) {
        console.error('Create note error:', error);
        return NextResponse.json(
            { error: 'Failed to upload note' },
            { status: 500 }
        );
    }
}
