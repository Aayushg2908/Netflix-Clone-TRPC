"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Watch = ({ params }: { params: { movieId: string } }) => {
  const router = useRouter();
  const { data } = trpc.movieById.useQuery(params.movieId);
  return (
    <div className="h-screen w-screen bg-black">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70">
        <ArrowLeftIcon
          onClick={() => router.push("/")}
          className="w-4 md:w-10 text-white cursor-pointer hover:opacity-80 transition"
        />
        <p className="text-white text-1xl md:text-3xl font-bold">
          <span className="font-light">Watching:</span> {data?.movie?.title}
        </p>
      </nav>
      <video
        className="h-full w-full"
        autoPlay
        controls
        src={data?.movie?.videoUrl}
      ></video>
    </div>
  );
};

export default Watch;
