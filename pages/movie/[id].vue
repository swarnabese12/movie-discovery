<!-- pages/movie/[id].vue -->
<template>
  <div class="container mx-auto px-4 py-8 text-white">
    <div v-if="loading" class="text-center">
      <div class="spinner"></div>
      <p>Fetching movie details, please wait...</p>
    </div>

    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      Error loading movie: {{ error }}
    </div>

    <div v-if="movie" class="bg-gray-900 rounded-lg shadow-lg p-6">
      <div class="relative h-96 mb-6">
        <img
          :src="movie.backdrop_path"
          :alt="movie.title"
          class="w-full h-full object-cover rounded-lg opacity-70"
        />
        <div
          class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900"
        >
          <h1 class="text-4xl font-bold">{{ movie.original_title }}</h1>
          <p class="text-xl mt-2">{{ movie.tagline }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <img
            :src="movie.poster_path"
            :alt="movie.title"
            class="w-full rounded-lg border-4 border-white"
          />

          <div class="mt-4 space-y-2">
            <p class="flex items-center">
              <Icon
                name="mdi:calendar-month"
                class="w-6 h-6 text-blue-500 drop-shadow-lg mr-2"
              />
              <span class="font-semibold mr-1">Release Date: </span>
              <span>{{ formatDate(movie.release_date) }}</span>
            </p>
            <p class="flex items-center">
              <Icon
                name="mdi:earth"
                class="w-6 h-6 text-blue-500 drop-shadow-lg mr-2"
              />
              <span class="font-semibold mr-1">Language: </span>
              <span>{{ movie?.original_language?.toUpperCase() }}</span>
            </p>
            <p class="flex items-center">
              <Icon
                name="mdi:alarm"
                class="w-6 h-6 text-blue-500 drop-shadow-lg mr-2"
              />
              <span class="font-semibold mr-1">Runtime: </span>
              <span>{{ movie.runtime }} minutes</span>
            </p>
            <p class="flex items-center">
              <Icon
                name="mdi:star"
                class="w-6 h-6 text-blue-500 drop-shadow-lg mr-2"
              />
              <span class="font-semibold mr-1">Rating: </span>
              <span
                >{{ movie.vote_average }} / 10 ({{
                  movie.vote_count
                }}
                votes)</span
              >
            </p>
            <p class="flex items-center">
              <Icon
                name="mdi:fire"
                class="w-6 h-6 text-blue-500 drop-shadow-lg mr-2"
              />
              <span class="font-semibold mr-1">Popularity:</span>
              <span>{{ movie.popularity }}</span>
            </p>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-2">📖 Overview</h2>
            <p class="text-gray-300">{{ movie.overview }}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-2">🎭 Cast</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div
                v-for="cast in movie.casts"
                :key="cast.id"
                class="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 relative group overflow-hidden"
              >
                <div class="relative">
                  <img
                    v-if="cast.profile_path"
                    :src="cast.profile_path"
                    :alt="cast.name"
                    class="w-full h-44 object-cover rounded-lg shadow-md transition-all duration-300"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 rounded-lg"
                  ></div>
                  <div
                    class="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1"
                  >
                    <Icon
                      name="mdi:star"
                      class="w-4 h-4 text-gray-600 drop-shadow-lg"
                    />
                    <span>{{ getFixed(cast?.popularity) }}</span>
                  </div>
                </div>

                <div class="mt-4 text-center">
                  <p class="font-semibold text-lg text-[#d9fdff] truncate">
                    {{ cast.name }}
                  </p>
                  <p class="text-gray-400 text-sm italic">
                    {{ cast.character }}
                  </p>
                </div>

                <div
                  class="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-blue-400 to-transparent opacity-0 group-hover:h-20 group-hover:opacity-100 transition-all duration-300 rounded-b-lg flex items-end justify-center"
                >
                  <p class="text-white font-semibold pb-2 pt-2">
                    🎬 Cast Member
                  </p>
                </div>
              </div>
            </div>
          </div>
          <NuxtLink
            to="/"
            class="inline-block bg-gray-900 text-white px-2 py-2 ml-7 text-xs rounded-lg font-semibold flex items-center gap-2 border border-blue-500 shadow-md hover:shadow-blue-500 hover:border-blue-400 transition duration-300 w-32"
          >
            ← Back to Movies
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// mdi:calendar-month
// mdi:earth
// mdi:alarm
// mdi:fire
// mdi:star
import { ref, onMounted } from "vue";
import { useRoute, useRuntimeConfig } from "#app";

const route = useRoute();
const config = useRuntimeConfig();

const movie = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // https://jsonfakery.com/movies/random/3
    // `${config.public.apiBase}/movie/${route.params.id}`
    const { data } = await useFetch(`${config.public.apiBase}/random`);
    console.log("Movie fetchedde-->", data?.value);

    if (data.value) {
      movie.value = data.value;
    } else {
      error.value = "Movie not found";
    }
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching movie:", err);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function getFixed(rating) {
  let roundedRating = Math.round(rating * 10) / 10;
  console.log(roundedRating);
  return roundedRating;
}
</script>

<style>
.spinner {
  @apply inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin;
  border-top-color: transparent;
}
</style>
