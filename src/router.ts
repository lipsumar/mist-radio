import { createRouter, createWebHistory } from "vue-router";
import SamplesView from "./views/SamplesView.vue";
import SequencerView from "./views/SequencerView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: SamplesView,
    },
    {
      path: "/sequencer",
      component: SequencerView,
    },
  ],
});

export default router;
