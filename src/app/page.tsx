"use client";
import Billboard from "@/components/Billboard";
import Navbar from "@/components/Navbar";
import { trpc } from "@/app/_trpc/client";
import MovieList from "@/components/MovieList";
import InfoModal from "@/components/InfoModal";
import useInfoModalStore from "@/hooks/useInfoModal";

export default function Home() {
  const { data: movies = [] } = trpc.allMovies.useQuery();
  const { data: favorites = [] } = trpc.allFavorites.useQuery();

  const { isOpen, closeModal } = useInfoModalStore();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  );
}
