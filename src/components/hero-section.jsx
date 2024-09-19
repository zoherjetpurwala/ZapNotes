"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LightningBoltIcon, Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./navbar";
import { signIn, useSession } from "next-auth/react";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session, status } = useSession();


  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-300 min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 overflow-hidden">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10"
      >
        <motion.h1
          className="text-4xl sm:text-7xl font-bold sm:mt-5 text-white mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Create <span className="text-yellow-400">notes</span> with a Zap
          <LightningBoltIcon className="inline-block ml-2 w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-slate-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Transform your workflow with seamless note-taking – Capture ideas with
          ease and let your thoughts flow without interruption.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {session ?(
            <Link href={"/notes"}>
            <Button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 active:scale-90 hover:scale-105 transition-all duration-300 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
            >
              Go to Notes
              <Pencil2Icon className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          ):(
            <Button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              size="lg"
              onClick={()=> signIn("google")}
              className="bg-purple-500 hover:bg-purple-600 active:scale-90 hover:scale-105 transition-all duration-300 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
            >
              Go to Notes
              <Pencil2Icon className="ml-2 w-5 h-5" />
            </Button>
          )}
          
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-12 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.div
          className="w-48 h-64 sm:w-64 sm:h-80 bg-white rounded-lg shadow-xl transform rotate-3"
          animate={{ rotate: isHovered ? 10 : 3 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-48 h-64 sm:w-64 sm:h-80 bg-purple-100 rounded-lg shadow-xl absolute top-2 left-2 transform -rotate-3"
          animate={{ rotate: isHovered ? -10 : -3 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-48 h-64 sm:w-64 sm:h-80 overflow-hidden bg-yellow-100 rounded-lg shadow-xl absolute top-4 left-4"
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="border-b-2 border-yellow-200 w-full h-8 mt-4" />
          <div className="border-b-2 border-yellow-200 w-full h-8 mt-4" />
          <div className="border-b-2 border-yellow-200 w-full h-8 mt-4" />
          <div className="border-b-2 border-yellow-200 w-full h-8 mt-4" />
          <div className="border-b-2 border-yellow-200 w-full h-8 mt-4" />
          <div className="border-b-2 border-yellow-200 w-full h-8 mt-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
