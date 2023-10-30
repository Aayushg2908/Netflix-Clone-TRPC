"use client";
import React, { useCallback, useMemo } from "react";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import { trpc } from "@/app/_trpc/client";
import { toast } from "react-hot-toast";

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  const { data: currentUser } = trpc.currentUser.useQuery();
  const { data } = trpc.allFavorites.useQuery();
  const addFavorite = trpc.addFavorite.useMutation({
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success("Added to favorites");
      }
    },
  });
  const deleteFavorite = trpc.deleteFromFavorites.useMutation({
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success("Removed from favorites");
      }
    },
  });

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(movieId);
  }, [currentUser, movieId]);

  const toggleFavorites = useCallback(async () => {
    let response;

    if (isFavorite) {
      await deleteFavorite.mutateAsync(movieId);
      if (deleteFavorite.data?.user) {
        response = deleteFavorite.data?.user;
      }
    } else {
      await addFavorite.mutateAsync(movieId);
      if (addFavorite.data?.user) {
        response = deleteFavorite.data?.user;
      }
    }

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, [
    movieId,
    isFavorite,
    addFavorite,
    deleteFavorite,
  ]);

  const Icon = isFavorite ? CheckIcon : PlusIcon;

  return (
    <div
      onClick={toggleFavorites}
      className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
    >
      <Icon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
    </div>
  );
};

export default FavoriteButton;
