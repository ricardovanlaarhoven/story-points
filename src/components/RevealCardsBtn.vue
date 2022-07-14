<template>
  <v-btn @click="revealCards" outlined v-bind="$attrs">reveal cards</v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, set } from "firebase/database";
import { realtimeDatabase } from "@/plugins/realtimeDatabase";

export default Vue.extend({
  name: "RevealCardsBtn",
  computed: {
    sessionId(): string {
      return this.$route.params.sessionId;
    }
  },
  methods: {
    revealCards() {
      set(ref(realtimeDatabase, `sessions/${this.sessionId}/isRevealed`), true);
    }
  }
});
</script>
