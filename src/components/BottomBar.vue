<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="bottom-bar">
    <div class="bottom-bar__buttons">
      <slot></slot>
    </div>
    <div class="bottom-bar__tabs">
      <div class="tabs">
        <RouterLink to="/" class="tabs__tab" activeClass="tabs__tab--active">
          <span>Samples</span>
        </RouterLink>
        <RouterLink
          to="/sequencer"
          class="tabs__tab"
          activeClass="tabs__tab--active"
        >
          <span>Sequencer</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.bottom-bar__buttons {
  display: flex;
  justify-content: center;
  padding-bottom: 1.4em;
  gap: 1em;
}

.tabs {
  display: flex;
  border-top: 1px solid #ccc;
}
.tabs__tab {
  padding: 0.8em 1.2em;
  font-size: 1em;
  font-weight: 600;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: background-color 0.25s;
  flex: 1;
  text-align: center;
  text-transform: uppercase;
}
.tabs__tab:first-child {
  border-right: 1px solid #ccc;
}
.tabs__tab--active > span {
  border-bottom: 2px solid #646cff;
}

.round-button {
  border: 1px solid transparent;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.round-button--record {
  background-color: #ff3b30;
}
.round-button--record::before {
  content: "";
  display: block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #fff;
  line-height: 0;
}

/* Add the pulsing animation when recording is active */
.round-button--record.active {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 59, 48, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
  }
}
</style>
