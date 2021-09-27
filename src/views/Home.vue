<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6" xl="4">
        <v-card>
          <v-card-title>
            <h1 class="text-h4">Start a session</h1>
          </v-card-title>
          <v-card-text>
            <VTextField label="session name" hint="Whats the session about?" v-model="form.sessionName"/>
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
import {child, push, ref, set} from 'firebase/database';
import {realtimeDatabase} from '@/plugins/realtimeDatabase';
import {mapState} from "vuex";

interface componentData {
  form: {
    sessionName: string,
    sessionId: string
  }
}

export default Vue.extend({
  name: 'Home',
  data: (): componentData => ({
    form: {
      sessionName: '',
      sessionId: ''
    },
  }),
  computed: {
    ...mapState(['userId'])
  },
  methods: {
    startNewSession(): void {
      const sessionId = push(child(ref(realtimeDatabase), 'sessions')).key;
      if (sessionId) {
        set(ref(realtimeDatabase, `sessions/${sessionId}`), {
          name: this.form.sessionName,
          ownerId: this.userId,
          participants: []
        });
        this.joinSession(sessionId);
        return
      }
      throw 'Could not get a key while creating a new session';
    },
    joinSession(sessionId: string): void {
      this.$router.push({name: 'session', params: {sessionId}});
    }
  }
})
</script>
