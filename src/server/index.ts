import prismadb from "@/libs/prismadb";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { without } from "lodash";

export const appRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { email, name, password } = opts.input;

      if (!email || !name || !password) {
        return {
          code: 400,
        };
      }

      const existingUser = await prismadb.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return {
          code: 422,
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prismadb.user.create({
        data: {
          email,
          name,
          hashedPassword,
          image: "",
          emailVerified: new Date(),
        },
      });

      return {
        code: 200,
        user: user,
      };
    }),
  currentUser: privateProcedure.query(async (opts) => {
    const user = await prismadb.user.findUnique({
      where: {
        email: opts.ctx.user?.email || "",
      },
    });

    return user;
  }),
  randomMovies: privateProcedure.query(async (opts) => {
    const movieCount = await prismadb.movie.count();
    const randomIndex = Math.floor(Math.random() * movieCount);

    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex,
    });

    return {
      code: 200,
      randomMovie: randomMovies[0],
    };
  }),
  allMovies: privateProcedure.query(async (opts) => {
    const movies = await prismadb.movie.findMany();

    return movies;
  }),
  addFavorite: privateProcedure.input(z.string()).mutation(async (opts) => {
    const existingMovie = await prismadb.movie.findUnique({
      where: {
        id: opts.input,
      },
    });

    if (!existingMovie) {
      return {
        code: 400,
        user: null,
      };
    }

    const user = await prismadb.user.update({
      where: {
        email: opts.ctx.user?.email || "",
      },
      data: {
        favoriteIds: {
          push: opts.input,
        },
      },
    });

    return {
      code: 200,
      user: user,
    };
  }),
  deleteFromFavorites: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: opts.input,
        },
      });

      if (!existingMovie) {
        return {
          code: 400,
          user: null,
        };
      }

      const user = await prismadb.user.findUnique({
        where: {
          email: opts.ctx.user?.email || "",
        },
      });

      const updatedIds = without(user?.favoriteIds, opts.input);

      const updatedUser = await prismadb.user.update({
        where: {
          email: opts.ctx.user?.email || "",
        },
        data: {
          favoriteIds: updatedIds,
        },
      });

      return {
        code: 200,
        user: updatedUser,
      };
    }),
  allFavorites: privateProcedure.query(async (opts) => {
    const user = await prismadb.user.findUnique({
      where: {
        email: opts.ctx.user?.email || "",
      },
    });
    const favoriteMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in: user?.favoriteIds,
        },
      },
    });

    return favoriteMovies;
  }),
  movieById: privateProcedure.input(z.string().nullish()).query(async (opts) => {
    const movieId = opts.input;
    if (!movieId) {
      return {
        code: 400,
        movie: null,
      };
    }

    const movie = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return {
        code: 401,
        movie: null,
      };
    }

    return {
      code: 200,
      movie: movie,
    };
  }),
});

export type AppRouter = typeof appRouter;
