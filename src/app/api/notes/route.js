import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserIdFromToken(req) {
  const token = await getToken({ req });
  return token?.sub;
}

function errorResponse(message, status = 401) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) return errorResponse("Unauthorized");

    const notes = await prisma.notes.findMany({
      where: { authorId: userId },
      select: { id: true, title: true, content: true }, 
    });

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function POST(req) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) return errorResponse("Unauthorized");

    const { id, title, content } = await req.json();

    const noteData = { title, content, authorId: userId };
    const note = id
      ? await prisma.notes.update({ where: { id, authorId: userId }, data: noteData })
      : await prisma.notes.create({ data: noteData });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error creating/updating note:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function DELETE(req) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) return errorResponse("Unauthorized");

    const { id } = await req.json();

    await prisma.notes.deleteMany({
      where: { id, authorId: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return errorResponse("Internal Server Error", 500);
  }
}

export async function PUT(req) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) return errorResponse("Unauthorized");

    const { id, title, content } = await req.json();
    const note = await prisma.notes.update({
      where: { id, authorId: userId },
      data: { title, content },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return errorResponse("Internal Server Error", 500);
  }
}