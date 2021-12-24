<template>
  <v-row class="flex-grow-0 justify-center align-end">
    <div
      class="card-wrapper ma-3 d-flex"
      v-for="n in [0, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?']"
      :key="n"
    >
      <v-card
        class="text-center fill-height card"
        :class="{ revealed: session.currentVotingId }"
        elevation="6"
        width="100px"
        height="150px"
        @click="setVote(n)"
      >
        <div class="text-h4 text-center ma-auto content">{{ n }}</div>
      </v-card>
    </div>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { ref, set } from "firebase/database";
import { realtimeDatabase } from "@/plugins/realtimeDatabase";
import { mapState } from "vuex";

export default Vue.extend({
  name: "Voting",
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(["userId"]),
    sessionId(): string {
      return this.$route.params.sessionId;
    }
  },
  methods: {
    setVote(vote: string | number): void {
      if (!this.session) {
        throw new Error("No session");
      }
      if (!this.session.currentVotingId) {
        throw new Error("No current voting id");
      }

      set(
        ref(
          realtimeDatabase,
          `sessions/${this.sessionId}/votings/${this.session.currentVotingId}/${this.userId}`
        ),
        vote
      );
    }
  }
});
</script>

<style scoped lang="scss">
.card-wrapper {
  padding-top: 0 !important;
  transition: padding 0.5s ease;
  &:hover {
    padding-bottom: 10px !important;
  }
}
</style>
