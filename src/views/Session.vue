<template>
  <v-container v-if="session">
    <v-row>
      <v-col>
        <h1 class="text-h3">{{ session.name }}</h1>
        <h6 class="text-subtitle-2">Join this session using this id: {{ sessionId }} or this link: {{
            currentLocation
          }}</h6>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-card>
          <v-list>
            <v-list-item v-for="(participant, index) in session.participants" :key="index">
              <v-list-item-icon>
                <v-icon v-if="index === session.ownerId">mdi-crown</v-icon>
                <v-icon v-else>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title :class="{'font-weight-bold': participantId === index}">
                  {{ participant.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <AddParticipantDialog :value="!participantId" :session-id="sessionId"/>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { onValue, ref } from 'firebase/database';
import { realtimeDatabase } from '@/plugins/realtimeDatabase.ts';
import { mapGetters } from 'vuex';
import AddParticipantDialog from '@/components/addParticipantDialog.vue';

export default Vue.extend({
  components: { AddParticipantDialog },
  data: () => ({
    session: null,
  }),
  computed: {
    ...mapGetters(['getParticipantId']),
    sessionId() {
      return this.$route.params.sessionId;
    },
    participantId() {
      return this.getParticipantId(this.sessionId);
    },
    isOwner() {
      return this.participantId === this.session.ownerId;
    },
    currentLocation() {
      return window.location.href;
    },
  },
  created() {
    this.joinSession();
    console.log();
  },
  methods: {
    joinSession() {
      this.watchSession();
      // this.addParticipant(this.form.name);
    },
    watchSession() {
      const session = ref(realtimeDatabase, `sessions/${this.sessionId}`);
      onValue(session, (snapshot) => {
        this.session = snapshot.val();
      });
    },
  },
});
</script>
