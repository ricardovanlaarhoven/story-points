<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="6" xl="4">
        <v-card>
          <v-form @submit.prevent="startNewSession">
            <v-card-title>
              <h1 class="text-h4">Start a session</h1>
            </v-card-title>
            <v-card-text>
              <p class="text-body-1">
                You can start a planning poker session here, choose the name of
                your session and share the link with your co-workers!
              </p>
              <VTextField
                label="session name"
                hint="Whats the session about?"
                v-model="form.sessionName"
              />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn class="mt-6" color="primary" type="submit">
                Create a session
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { child, push, ref, set } from "firebase/database";
import { realtimeDatabase } from "@/plugins/realtimeDatabase";
import { mapState } from "vuex";

interface componentData {
  form: {
    sessionName: string;
    sessionId: string;
  };
}

export default Vue.extend({
  name: "Home",
  data: (): componentData => ({
    form: {
      sessionName: "",
      sessionId: ""
    }
  }),
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    startNewSession(): void {
      const sessionId = push(child(ref(realtimeDatabase), "sessions")).key;
      if (sessionId) {
        set(ref(realtimeDatabase, `sessions/${sessionId}`), {
          name: this.form.sessionName,
          ownerId: this.userId,
          isRevealed: false,
          participants: [],
          currentVotingId: "",
          votings: []
        });
        this.joinSession(sessionId);
        return;
      }
      throw "Could not get a key while creating a new session";
    },
    joinSession(sessionId: string): void {
      this.$router.push({ name: "session", params: { sessionId } });
    }
  }
});
</script>
