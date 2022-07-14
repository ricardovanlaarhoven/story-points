<template>
  <v-row class="flex-grow-0 justify-center align-end">
    <div class="card-wrapper ma-3 d-flex" v-for="n in votingOptions" :key="n">
      <v-card
        class="text-center fill-height card"
        :class="{ revealed: session.currentVotingId }"
        elevation="6"
        @click="setVote(n)"
      >
        <div class="content">{{ n }}</div>
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
    },
    votingOptions() {
      if (!this.session.votingOptions) {
        return ["½", 0, 1, 2, 3, 5, 8, 13, 20, 40, 100, "?"];
      }
      return this.session.votingOptions.split(",");
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
  transition: margin 0.5s ease;
  width: 6vw;
  max-width: 100px;
  max-height: 150px;
  height: 10vw;
  &:hover {
    margin-top: 0 !important;
    margin-bottom: 24px !important;
  }
  .card {
    width: 100%;
    font-size: 2.5vw;
  }

  @media (max-width: 1000px) {
    width: 12vw;
    height: 20vw;
    .card {
      font-size: 5vw;
    }
  }
}
</style>
