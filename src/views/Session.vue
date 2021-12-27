<template>
  <v-col v-if="session" class="fill-height d-flex flex-column">
    <v-row class="flex-grow-0">
      <v-col>
        <h1 class="text-h3">{{ session.name }}</h1>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              @click="copySessionToClipboard"
              v-on="on"
              color="grey"
              class="px-0"
            >
              Share Session
            </v-btn>
          </template>
          <span
            >Click here to copy a link to this session, to share it with your
            colleagues</span
          >
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1" justify="center">
      <v-col md="10" lg="8" xl="6">
        <PokerTable :session="session" />
      </v-col>
      <AddParticipantDialog :value="!hasJoined" :session-id="sessionId" />
    </v-row>
    <Voting :session="session" />
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import { onValue, push, ref, set } from "firebase/database";
import { realtimeDatabase } from "@/plugins/realtimeDatabase.ts";
import { mapState } from "vuex";
import AddParticipantDialog from "@/components/addParticipantDialog.vue";
import PokerTable from "@/components/PokerTable.vue";
import Voting from "@/components/Voting.vue";

interface session {
  name: string;
  ownerId: string;
  participants?: Record<string, { name: string }>;
  currentVotingId?: string;
  votings?: Record<string, Record<string, string | number>>;
  isRevealed: boolean;
}

interface componentData {
  session: session | null;
}

export default Vue.extend({
  components: {
    Voting,
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
    copySessionToClipboard() {
      navigator.clipboard.writeText(this.currentLocation);
    }
  }
});
</script>
