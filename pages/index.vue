<template>
  <client-only>
    <div class="relative w-full h-screen" v-if="isHome">
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${featuredMovie?.backdrop_path})` }"
      ></div>

      <div class="absolute inset-0 bg-black bg-opacity-60"></div>

      <!-- <Icon name="mdi:castle" class="w-6 h-6 text-blue-500 drop-shadow-lg" /> -->
      <div
        class="absolute top-4 left-6 flex justify-center items-center bg-[#1b2431] ml-4 mt-2"
      >
        <Icon
          name="mdi:movie-roll"
          class="w-8 h-8 text-[#d9fdff] drop-shadow-lg ml-1"
        />
        <h1
          class="text-[2rem] leading-[1] tracking-[0.05em] font-thin font-[Liberty] flex space-x-1"
        >
          <span
            class="text-[#d9fdff] drop-shadow-[0_0_1rem_#00f0ff] inline-block"
            >D</span
          >
          <span
            class="text-[#d9fdff] drop-shadow-[0_0_1rem_#00f0ff] inline-block"
            >I</span
          >
          <span
            class="text-[#d9fdff] drop-shadow-[0_0_1rem_#00f0ff] inline-block"
            >S</span
          >
          <span
            class="text-[#d9fdff] drop-shadow-[0_0_1rem_#00f0ff] inline-block"
            >N</span
          >
          <span
            class="text-[#d9fdff] drop-shadow-[0_0_1rem_#00f0ff] inline-block"
            >E</span
          >
          <span
            class="text-[#d9fdff] drop-shadow-[0_0_1rem_#00f0ff] inline-block"
            >Y</span
          >
        </h1>
      </div>

      <div
        class="relative z-10 flex flex-col justify-center items-start h-full text-white px-6 text-left pl-12"
      >
        <div class="max-w-3xl">
          <h1 class="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            {{ featuredMovie?.original_title }}
          </h1>

          <div class="flex gap-2 mb-3">
            <span
              v-for="genre in featuredMovie?.genres"
              :key="genre.id"
              class="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-lg"
            >
              {{ genre.name }}✨
            </span>
          </div>

          <p class="text-gray-300 text-lg">
            {{ featuredMovie?.overview?.slice(0, 320) }}...
          </p>

          <p class="text-gray-400 mt-2">
            📅 {{ formatDate(featuredMovie?.release_date) }}
          </p>

          <div class="mt-6 flex gap-4">
            <a
              :href="featuredMovie?.trailer_url"
              target="_blank"
              class="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 border border-red-500 shadow-md hover:shadow-red-500 hover:border-red-400 transition duration-300"
            >
              <Icon name="mdi:movie-open-play" class="w-6 h-6 text-red-400" />
              <span>Watch Trailer</span>
            </a>

            <button
              @click="isHome = false"
              class="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 border border-blue-500 shadow-md hover:shadow-blue-500 hover:border-blue-400 transition duration-300"
            >
              <Icon name="mdi:filmstrip" class="w-6 h-6 text-blue-400" />
              <span>View More Movies</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8" v-else>
      <div class="flex justify-between items-center mb-4">
        <button
          @click="isHome = true"
          class="bg-gray-900 text-white px-3 py-2 ml-7 text-sm rounded-lg font-semibold flex items-center gap-2 border border-blue-500 shadow-md hover:shadow-blue-500 hover:border-blue-400 transition duration-300"
        >
          <Icon name="mdi:keyboard-backspace" class="w-5 h-5 text-blue-400" />
          <span>Back to Home</span>
        </button>

        <!-- <div class="space-x-2">
          <Icon name="mdi:movie-open-play" class="w-6 h-6 text-blue-400" />
          <Icon name="mdi:movie-open-settings" class="w-6 h-6 text-green-400" />
          <Icon name="mdi:movie-roll" class="w-6 h-6 text-yellow-400" />
          <Icon name="mdi:movie-open-cog" class="w-6 h-6 text-red-400" />
          <Icon name="mdi:popcorn" class="w-6 h-6 text-purple-400" />
          <Icon name="mdi:clapperboard" class="w-6 h-6 text-orange-400" />
          <Icon name="mdi:ticket-confirmation" class="w-6 h-6 text-teal-400" />
          <Icon name="mdi:star" class="w-6 h-6 text-yellow-500" />
          <Icon name="mdi:video-vintage" class="w-6 h-6 text-pink-400" />
          <Icon name="mdi:projector" class="w-6 h-6 text-cyan-400" />
        </div> -->
        <!-- Search Bar -->
        <input
          v-model="searchTerm"
          placeholder="Search for a movie..."
          class="px-4 py-2 mr-7 rounded-lg bg-gray-900 text-white w-64 border border-blue-500 shadow-md focus:shadow-blue-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none transition duration-300"
        />
      </div>

      <div v-if="loading" class="text-center text-white">
        <div class="spinner"></div>
        <p>Loading movies...</p>
      </div>
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        Error loading movies: {{ error }}
      </div>

      <div
        v-if="filteredMovies.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6"
      >
        <div
          v-for="movie in filteredMovies"
          :key="movie.id"
          class="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="relative">
            <img
              :src="movie.backdrop_path"
              :alt="movie.original_title"
              class="w-full h-48 object-cover opacity-70"
            />
            <img
              :src="movie.poster_path"
              :alt="movie.original_title"
              class="w-20 h-28 object-cover rounded-lg absolute bottom-2 left-2 border-2 border-white"
            />
          </div>

          <div class="p-4">
            <h2 class="text-lg font-semibold">{{ movie.original_title }}</h2>
            <p class="text-gray-400 text-sm">
              📅 {{ formatDate(movie.release_date) }} | 🌍
              {{ movie?.original_language?.toUpperCase() }}
            </p>
            <p class="text-yellow-400 mt-1">
              ⭐ {{ movie.vote_average }} / 10 ({{ movie.vote_count }} votes)
            </p>
            <p class="text-green-400 text-sm">
              🔥 Popularity: {{ movie.popularity }}
            </p>
            <p class="text-gray-300 text-sm mt-2">
              {{ movie.overview.slice(0, 200) }}...
            </p>
            <NuxtLink
              :to="`/movie/${movie.id}`"
              class="mt-3 inline-block text-blue-400 hover:text-blue-500 font-semibold"
              >Read More →</NuxtLink
            >
          </div>
        </div>
      </div>

      <p v-else class="text-white text-center text-lg">No movies found.</p>

      <div class="mt-8 flex justify-center gap-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-white">Page {{ currentPage }}</span>
        <button
          @click="nextPage"
          :disabled="!hasNextPage"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </client-only>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useFetch, useRuntimeConfig } from "#app";
import rrrImage from "../images/naruto2.jpg";

const config = useRuntimeConfig();
const movies = ref([]);
const currentPage = ref(1);
const perPage = 12;
const totalPages = ref(1);
const searchTerm = ref("");
const loading = ref(true);
const error = ref(null);
let isHome = ref(true);

const hasNextPage = computed(() => currentPage.value < totalPages.value);

let featuredMovie = {
  id: 2,
  original_title: "Naruto Shippuden",
  overview:
    "Naruto Uzumaki continues his journey to become Hokage while facing powerful enemies, uncovering secrets about his past, and protecting his friends from the looming threat of the Akatsuki. With determination and the power of the Nine-Tails, he forges unbreakable bonds and fights to bring peace to the ninja world.",
  release_date: "2007-02-15",
  genres: [
    { id: 16, name: "Anime" },
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 14, name: "Fantasy" },
  ],
  backdrop_path: rrrImage,
  poster_path: rrrImage,
  trailer_url: "https://www.youtube.com/watch?v=22R0j8UKRzY",
};

const filteredMovies = computed(() => {
  if (!searchTerm.value) return movies.value;
  return movies.value.filter((movie) =>
    movie.original_title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

watch(currentPage, fetchMovies, { immediate: true });

async function fetchMovies() {
  loading.value = true;
  error.value = null;

  try {
    const { data } = await useFetch(`${config.public.apiBase}/paginated`, {
      query: {
        page: currentPage.value,
        limit: perPage,
      },
    });

    if (data?.value) {
      movies.value = data.value.data || [];
      totalPages.value = Math.ceil(data.value.total / perPage);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

function nextPage() {
  if (hasNextPage.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

const formatGenres = (genres) =>
  genres?.map((g) => g.name).join(", ") || "Unknown";
</script>

<style>
body {
  background-color: #121212;
}
.spinner {
  @apply inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin;
  border-top-color: transparent;
}

@font-face {
  font-family: "Liberty";
  src: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/907368/liberty.otf");
}

.letter-2 {
  transform: translate(-0.2rem, 1rem) rotate(10deg);
  animation: flicker 2s ease-in-out infinite alternate;
}

@keyframes flicker {
  0%,
  5% {
    opacity: 1;
    transform: translate(-0.2rem, 1rem) rotate(10deg);
  }
  5.5% {
    opacity: 0;
    transform: translate(-0.2rem, 1rem) rotate(10deg);
  }
  6%,
  6.5% {
    opacity: 1;
    transform: translate(-0.2rem, 1rem) rotate(10deg);
  }
  7% {
    opacity: 0;
    transform: translate(-0.2rem, 1rem) rotate(10deg);
  }
  8%,
  50% {
    opacity: 1;
    transform: translate(-0.2rem, 1rem) rotate(13deg);
  }
  100% {
    opacity: 1;
    transform: translate(-0.2rem, 1rem) rotate(10deg);
  }
}
</style>
