<template>
  <v-col v-if="session" class="fill-height d-flex flex-column">
    <v-row class="flex-grow-0">
      <v-col>
        <h1 class="text-h3">{{ session.name }}</h1>
        <h6 class="text-subtitle-2">
          Join this session using this id: {{ sessionId }} or this link:
          {{ currentLocation }}
        </h6>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1">
      <v-col cols="2">
        <v-card class="mt-3">
          <v-card-text>
            <v-btn @click="createNewVoting" text>start new voting</v-btn>
            {{ this.session.currentVotingId }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <PokerTable :session="session" />
      </v-col>
      <AddParticipantDialog :value="!hasJoined" :session-id="sessionId" />
    </v-row>
    <v-row class="flex-grow-0 justify-center">
      <v-card
        class="text-center fill-height ma-3 d-flex"
        elevation="6"
        v-for="n in [0, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?']"
        :key="n"
        width="100px"
        height="150px"
        @click="setVote(n)"
      >
        <div class="text-h4 text-center ma-auto">{{ n }}</div>
      </v-card>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import { onValue, push, ref, set } from "firebase/database";
import { realtimeDatabase } from "@/plugins/realtimeDatabase.ts";
import { mapState } from "vuex";
import AddParticipantDialog from "@/components/addParticipantDialog.vue";
import PokerTable from "@/components/PokerTable.vue";

interface session {
  name: string;
  ownerId: string;
  participants: Record<string, { name: string }>;
  currentVotingId?: string;
  votings: Record<string, Record<string, string | number>>;
}

interface componentData {
  session: session | null;
}

export default Vue.extend({
  components: {
    PokerTable,
    AddParticipantDialog
  },
  data: (): componentData => ({
    session: null
  }),
  computed: {
    ...mapState(["userId"]),
    sessionId(): string {
      return this.$route.params.sessionId;
    },
    isOwner(): boolean {
      return this.userId === this.session?.ownerId;
    },
    currentLocation(): string {
      return window.location.href;
    },
    hasJoined(): boolean {
      if (!this.session?.participants) return false;
      return this.session?.participants[this.userId] !== undefined;
    }
  },
  created() {
    this.joinSession();
  },
  methods: {
    joinSession(): void {
      this.watchSession();
    },
    watchSession(): void {
      const session = ref(realtimeDatabase, `sessions/${this.sessionId}`);
      onValue(session, snapshot => {
        this.session = snapshot.val();
      });
    },
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
    },
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
