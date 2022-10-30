<script setup lang="ts">
import Projects from './components/Projects.vue'
</script>

<template>
  <Projects></Projects>
</template>

<style>
  body.masked {
    overflow-y: hidden;
  }

  a {
    text-decoration: none;
    color: #39C5BB;
    transition: color .5s;
    text-shadow: 0 0 1px #66CCFF;
  }
  a:hover {
    text-decoration: underline;    
  }
  a:active {
    color: black
  }
</style>
