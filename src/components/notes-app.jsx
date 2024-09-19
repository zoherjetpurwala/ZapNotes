"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./ui/loading-spinner";

export function NotesAppComponent() {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  
  const fetchNotes = async () => {
    const response = await fetch("/api/notes");
    if (response.ok) {
      const data = await response.json();
      setNotes(data);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "unauthenticated") {
      router.push("/");
    } else {
      setLoading(false);
      fetchNotes();

    }
  }, [status, router]);

  if (loading) {
    return <LoadingSpinner />;
  }



  const handleNewNote = () => {
    setCurrentNote({ title: "New Note", content: "" });
    setIsModalOpen(true);
  };

  const handleNoteClick = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!session) {
      console.error("You need to log in to save a note");
      return;
    }

    if (currentNote) {
      const method = currentNote.id ? "PUT" : "POST";

      // Attach the userId from the session when saving a new note
      const response = await fetch("/api/notes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentNote,
          authorId: session.user.id, // Add the authorId when saving
        }),
      });

      if (response.ok) {
        fetchNotes();
        setIsModalOpen(false);
      } else {
        console.error("Error saving note");
      }
    }
  };

  const handleDeleteNote = async () => {
    if (!session) {
      console.error("You need to log in to delete a note");
      return;
    }

    if (currentNote && currentNote.id) {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentNote.id,
          userId: session.user.id, // Pass userId to ensure ownership
        }),
      });

      if (response.ok) {
        fetchNotes();
        setIsModalOpen(false);
      } else {
        console.error("Error deleting note");
      }
    }
  };

  return (
    <div className="relative sm:p-4 min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-300"></div>
      <div className="relative pt-20 z-10 mx-auto max-w-7xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">My Notes</h1>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  rotateZ: 10,
                  transition: { duration: 0.5, ease: "anticipate" },
                }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow min-h-48 bg-yellow-200 bg-opacity-90"
                  onClick={() => handleNoteClick(note)}
                >
                  <CardContent className="p-4">
                    <h2 className="font-semibold mb-2">{note.title}</h2>
                    <div className="border border-yellow-400 w-full" />
                    <p className="text-sm mt-2 text-gray-600 line-clamp-6">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          onClick={handleNewNote}
          className="fixed bottom-10 right-8 2xl:bottom-20 2xl:right-80 bg-purple-900 hover:bg-purple-600 hover:scale-105 active:scale-90 transition-all duration-300 text-white font-semibold py-8 px-5  rounded-3xl shadow-lg flex items-center justify-center"
          aria-label="New Note"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[380px] rounded-2xl sm:max-w-[500px] p-8 bg-white">
            <DialogHeader>
              <DialogTitle>
                <Input
                  value={currentNote?.title || ""}
                  onChange={(e) =>
                    setCurrentNote((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="text-lg font-semibold border-purple-300"
                />
              </DialogTitle>
            </DialogHeader>
            <Textarea
              value={currentNote?.content || ""}
              onChange={(e) =>
                setCurrentNote((prev) => ({ ...prev, content: e.target.value }))
              }
              className="min-h-[200px] border-purple-300"
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleDeleteNote}
                className="border-purple-300"
              >
                Delete
              </Button>
              <Button
                onClick={handleSaveNote}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
