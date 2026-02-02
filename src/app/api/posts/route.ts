import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
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
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const type = formData.get('type') as 'BLOG' | 'MEDIA';
        const file = formData.get('file') as File | null;

        let mediaUrl = null;

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${Date.now()}-${file.name}`;
            const filepath = join(process.cwd(), 'public', 'uploads', filename);

            await writeFile(filepath, buffer);
            mediaUrl = `/uploads/${filename}`;
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                type,
                mediaUrl,
                authorId: user.userId,
            },
            include: {
                author: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return NextResponse.json({ post, success: true });
    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
