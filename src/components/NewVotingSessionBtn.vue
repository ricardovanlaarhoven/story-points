<template>
  <v-btn @click="createNewVoting" outlined color="white"
    >new voting session</v-btn
  >
</template>

<script lang="ts">
import Vue from "vue";
import { push, ref, set } from "firebase/database";
import { realtimeDatabase } from "@/plugins/realtimeDatabase";

export default Vue.extend({
  name: "NewVotingSessionBtn",
  computed: {
    sessionId(): string {
      return this.$route.params.sessionId;
    }
  },
  methods: {
    createNewVoting() {
      const votingsRef = ref(
        realtimeDatabase,
        `sessions/${this.sessionId}/votings`
      );
      const votingId = push(votingsRef).key;
      set(
        ref(realtimeDatabase, `sessions/${this.sessionId}/currentVotingId`),
        votingId
      );
      set(
        ref(realtimeDatabase, `sessions/${this.sessionId}/isRevealed`),
        false
      );
    }
  }
});
</script>
