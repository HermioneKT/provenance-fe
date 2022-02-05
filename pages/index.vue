<template>
  <main>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
    <ul>
      <li
        v-for="page in ['Options API', ]"
        :key="page"
      >
        <nuxt-link :to="`/${page.toLowerCase().split(' ').join('-')}`">
          With {{ page }}
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
export default {
  name: 'PageIndex'
}
</script>
