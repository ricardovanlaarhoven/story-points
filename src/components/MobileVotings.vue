<template>
  <div>
    <v-row>
      <v-col
        cols="4"
        class="text-center"
        v-for="[participantId, participant] in Object.entries(
          session.participants
        )"
        :key="participantId"
      >
        <div :title="participant.name" class="text-truncate">
          <v-icon v-if="participantId === session.ownerId">mdi-crown</v-icon>
          <v-icon v-else>mdi-account</v-icon>
          {{ participant.name }}
        </div>
        <div
          class="card"
          v-if="currentVotings[participantId] !== undefined"
          :class="{
            revealed: session.isRevealed || participantId === userId
          }"
        >
          <div
            class="content"
            v-if="session.isRevealed || participantId === userId"
          >
            {{ currentVotings[participantId] }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center mt-6">
      <NewVotingSessionBtn
        v-if="isOwner && (session.isRevealed || !session.currentVotingId)"
      />
      <RevealCardsBtn
        class="ml-3"
        v-if="isOwner && session.currentVotingId && !session.isRevealed"
      />
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RevealCardsBtn from "@/components/RevealCardsBtn.vue";
import NewVotingSessionBtn from "@/components/NewVotingSessionBtn.vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "MobileVotings",
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
