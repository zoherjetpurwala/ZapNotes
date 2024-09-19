import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notes = await prisma.notes.findMany({
    where: { authorId: session.user.id },
  });

  return NextResponse.json(notes);
}

export async function POST(request) {
    const { id, title, content, authorId } = await request.json();
  
    if (!authorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    // Handle both create and update operations
    if (id) {
      // Update existing note
      const updatedNote = await prisma.notes.update({
        where: { id },
        data: { title, content },
      });
      return NextResponse.json(updatedNote);
    } else {
      // Create a new note
      const newNote = await prisma.notes.create({
        data: { title, content, authorId },
      });
      return NextResponse.json(newNote);
    }
  }
  
  export async function DELETE(request) {
    const { id, userId } = await request.json();
  
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    // Ensure that the note belongs to the current user
    const note = await prisma.notes.findUnique({ where: { id } });
  
    if (note.authorId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    await prisma.notes.delete({ where: { id } });
  
    return NextResponse.json({ success: true });
  }

export async function PUT(request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, content } = await request.json();
  const note = await prisma.notes.update({
    where: { id, authorId: session.user.id },
    data: { title, content },
  });

  return NextResponse.json(note);
}

