<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6" xl="4">
        <v-card>
          <v-card-title>
            <h1 class="text-h4">Start a session</h1>
          </v-card-title>
          <v-card-text>
            <VTextField label="name" hint="Whats your name?" v-model="form.name"/>
            <VTextField label="session name" hint="Whats the session about?" v-model="form.sessionName"/>
            <!--    <v-btn>Join a session</v-btn>-->
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn @click="startNewSession" class="mt-6" color="primary">Create a session</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" xl="4">
        <v-card>
          <v-card-title>
            <h2 class="text-h4">Join a session</h2>
          </v-card-title>
          <v-card-text>
            <VTextField label="session id" hint="Whats the session id you received?" v-model="form.sessionId"/>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn @click="joinSession(form.sessionId)" class="mt-6" color="primary">Join a session</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {child, push, ref, set, update} from 'firebase/database';
import {realtimeDatabase} from '@/plugins/realtimeDatabase';
import {mapMutations} from "vuex";

export default Vue.extend({
  name: 'Home',
  data: () => ({
    form: {
      name: '',
      sessionName: '',
      sessionId: ''
    },
  }),
  created() {
    // set(ref(realtimeDatabase, 'sessions/' + '1234'), {
    //   name: 'Shift4u Poker sessie',
    //   participants: [{name: 'Ricardo'}, {name: 'Paul'}, {name: 'Rick'}]
    // });
    //
    // console.log();
    //

  },
  methods: {
    ...mapMutations(['setParticipantId']),
    startNewSession() {
      this.sessionId = push(child(ref(realtimeDatabase), 'sessions')).key;

      set(ref(realtimeDatabase, `sessions/${this.sessionId}`), {
        name: this.form.sessionName,
        participants: []
      });
      this.addParticipant(this.form.name);
      this.setParticipantId({participantId: this.participantId, sessionId: this.sessionId});
      this.setOwner();
      this.joinSession(this.sessionId);
    },
    setOwner() {
      update(ref(realtimeDatabase, `sessions/${this.sessionId}`), {
        ownerId: this.participantId
      });
    },
    addParticipant(name: string) {
      this.participantId = push(child(ref(realtimeDatabase), 'sessions')).key;
      set(ref(realtimeDatabase, `sessions/${this.sessionId}/participants/${this.participantId}`), {
        name: name
      });
    },
    joinSession(sessionId: string) {
      this.$router.push({name: 'session', params: {sessionId}});
    }
  }
})
</script>
