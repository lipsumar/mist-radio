<script setup lang="ts">
defineProps({
  message: String,
});
</script>

<template>
  <div class="empty-state">{{ message }}</div>
</template>

<style>
.empty-state {
  width: 130px;
  margin: 30vh auto 0;

  text-align: center;
  opacity: 0.5;
  text-wrap: balance;
}
</style>
