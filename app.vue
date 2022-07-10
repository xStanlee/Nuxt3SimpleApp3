<script setup lang="ts">
  import { customizeImage } from '@/helperFunc'

  const config = useRuntimeConfig();
  const cookie = useCookie('city');

  cookie.value = !cookie.value ? 'Wroclaw' : cookie.value; 

  const search = ref(cookie.value);
  const input = ref("");
  const background = ref("");
  // Arrow function inside fetch, because anytime when search.value is changed the useFetch is recalled
  // const { data: city, error } = useFetch(() => `https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=4043e57b1931d2e394152c1b8a0a70e0`);
  const { data: city, error } = useAsyncData("city", async () => {
    let response;
    
    try {
      response = await $fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search.value}`, {
        params: {
          units: 'metric',
          appid: config.WEATHER_APP_ID_KEY
        }
      }) as any;
      cookie.value = search.value
      const temp = response?.main?.temp;
      background.value = customizeImage(temp)
    } catch(e) {
      
    }
    return response;
  }, {
    watch: [search]
  });

  let today: Date = new Date();
  let todayInString: string;

  todayInString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  const handleClick = () => {
    const formatedSearch = input.value.trim().split(" ").join("+");
    search.value = formatedSearch;
    input.value = "";
  }

  const goBack = () => {
    search.value = cookie.value;
  }

</script>

<template>
  <div v-if="city" class="h-screen relative overflow-hidden">
    <img :src="background" :alt="background"/>
    <div class="absolute w-full h-full top-0 overlay" />
    <div class="absolute w-full h-full top-0 p-48">
      <div class="flex justify-between">
        <div>
          <h1 class="text-7xl text-white">{{city.name}}</h1>
          <p class="font-extralight text-2xl mt-2 text-white">{{ todayInString }}</p>
          <img class="w-56 icon" :src="`https://openweathermap.org/img/wn/${city.weather[0].icon}@4x.png`" :alt="city"/>
        </div>
        <div>
          <p class="text-9xl text-white font-extralight">
            {{ city.main.temp }}°
          </p>
        </div>
      </div>
      <div class="mt-20">
        <input type="text" class="w-1/2 h-10" placeholder="Search a city..." v-model="input">
        <button class="bg-sky-400 w-20 text-white h-10" @click="handleClick()">Search</button>
      </div>
    </div>
  </div>
  <div v-else class="p-10 justify-center">
    <h1 class="text-7xl">Oops, we can't find that city ;/</h1>
    <button class="mt-5 bg-sky-400 px-10 w-50 text-white h-10" @click="goBack()">
      Go back
    </button>
  </div>
</template>

<style scoped>
.overlay {
  background-color: rgba(0, 0, 0, .5);
}

.icon {
  margin: -2.75rem 0 0 -2.75rem
}
</style>