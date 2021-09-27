<template>
  <v-col v-if="session" class="fill-height d-flex flex-column">
    <v-row class="flex-grow-0">
      <v-col>
        <h1 class="text-h3">{{ session.name }}</h1>
        <h6 class="text-subtitle-2">Join this session using this id: {{ sessionId }} or this link: {{
            currentLocation
          }}</h6>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1">
      <v-col cols="2">
        <v-card>
          <v-list>
            <v-list-item v-for="(participant, index) in session.participants" :key="index">
              <v-list-item-icon>
                <v-icon v-if="participant.userId === session.ownerId">mdi-crown</v-icon>
                <v-icon v-else>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title :class="{'font-weight-bold': participant.userId === userId}">
                  {{ participant.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="mt-3">
          <v-card-text>
            hi
          </v-card-text>
        </v-card>
      </v-col>
      <AddParticipantDialog :value="!participantId" :session-id="sessionId"/>
    </v-row>
    <v-row class="flex-grow-0 justify-center">
      <v-card class="text-center fill-height ma-3 d-flex"
              elevation="6"
              v-for="n in [0,1,2,3,5,8,13,20,40,100, '?']"
              :key="n"
              width="100px" height="150px">
        <div class="text-h4 text-center ma-auto">{{ n }}</div>
      </v-card>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue';
import {onValue, ref} from 'firebase/database';
import {realtimeDatabase} from '@/plugins/realtimeDatabase.ts';
import {mapState} from 'vuex';
import AddParticipantDialog from '@/components/addParticipantDialog.vue';

interface session {
  name: string,
  ownerId: string,
  participants: [{ name: string, userId: string }]
}

interface componentData {
  session: session | null
}

export default Vue.extend({
  components: {AddParticipantDialog},
  data: (): componentData => ({
    session: null,
  }),
  computed: {
    ...mapState(['userId']),
    sessionId(): string {
      return this.$route.params.sessionId;
    },
    participantId(): string | undefined {
      if (!this.session?.participants) return undefined;
      const participant = Object.values(this.session.participants).find((participant) => participant.userId === this.userId);
      return participant ? participant.userId : undefined;
    },
    isOwner(): boolean {
      return this.participantId === this.session?.ownerId;
    },
    currentLocation(): string {
      return window.location.href;
    },
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
      onValue(session, (snapshot) => {
        this.session = snapshot.val();
      });
    },
  },
});
</script>
