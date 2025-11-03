<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="blue">{{ msg }}</h1>
    <h3>
      Lets's track our plants! My name is
      <br>
      <a href="https://github.com/xn4k" target="_blank" rel="noopener">Mikhail!</a> I built this for my friends
      <br>
      using
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      <br>
      What's next?
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  color: cornflowerblue;
}

h3 {
  font-size: 1.2rem;
  color: cadetblue;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
