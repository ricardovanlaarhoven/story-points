<template>
  <div class="poker-wrapper">
    <div class="players">
      <div
        class="player--wrapper"
        :class="`player--wrapper__${i + 1}`"
        v-for="([participantId, participant], i) in Object.entries(
          session.participants
        )"
        :key="i"
      >
        <div class="player" :style="`background-color: ${participant.color}`">
          <div
            class="player--name"
            :class="{ 'font-weight-bold': participantId === userId }"
          >
            <v-icon v-if="participantId === session.ownerId">mdi-crown</v-icon>
            <v-icon v-else>mdi-account</v-icon>
            {{ participant.name }}
          </div>
        </div>
        <div
          class="card"
          v-if="currentVotings[participantId]"
          :class="{
            revealed: session.isRevealed
          }"
        >
          <div class="content" v-if="session.isRevealed">
            {{ currentVotings[participantId] }}
          </div>
        </div>
      </div>
    </div>
    <div class="table d-flex justify-center align-center">
      <NewVotingSessionBtn v-if="isOwner" />
      <RevealCardsBtn class="ml-3" v-if="isOwner" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import NewVotingSessionBtn from "@/components/NewVotingSessionBtn.vue";
import RevealCardsBtn from "@/components/RevealCardsBtn.vue";

export default Vue.extend({
  name: "PokerTable",
  components: { RevealCardsBtn, NewVotingSessionBtn },
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(["userId"]),
    isOwner(): boolean {
      return this.userId === this.session?.ownerId;
    },
    currentVotings(): Record<string, unknown>[] {
      if (
        !this.session ||
        !this.session.votings ||
        !this.session.currentVotingId
      )
        return [];
      const currentVoting = this.session.votings[this.session.currentVotingId];

      if (!currentVoting) return [];
      return currentVoting;
    }
  }
});
</script>
