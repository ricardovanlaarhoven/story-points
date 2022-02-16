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
                label="Session name"
                hint="What's the session about?"
                v-model="form.sessionName"
              />
              <VSelect
                label="Voting options"
                v-model="form.votingOptions"
                placeholder="Custom option"
                persistent-placeholder
                :items="votingOptions"
              />
              <VTextField label="Voting options" v-model="form.votingOptions" />
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
    votingOptions: string;
  };
  votingOptions: { text: string; value: string }[];
}

export default Vue.extend({
  name: "Home",
  data: (): componentData => ({
    form: {
      sessionName: "",
      sessionId: "",
      votingOptions: ""
    },
    votingOptions: []
  }),
  computed: {
    ...mapState(["userId"])
  },
  created() {
    this.votingOptions = [
      {
        text: "Modified Fibonacci",
        value: "0,½,1,2,3,5,8,13,20,40,100"
      },
      {
        text: "Fibonacci",
        value: "0,1,2,3,5,8,13,21,34,55,89"
      },
      {
        text: "Short modified Fibonacci",
        value: "0,½,1,2,3,5,8,13,20"
      },
      {
        text: "t-shirt sizes",
        value: "xs,s,m,l,xl"
      },
      {
        text: "Doubling of numbers",
        value: "1,2,4,8,16,32,64"
      }
    ];
    this.form.votingOptions = this.votingOptions[0].value;
  },
  methods: {
    startNewSession(): void {
      const sessionId = push(child(ref(realtimeDatabase), "sessions")).key;
      if (sessionId) {
        set(ref(realtimeDatabase, `sessions/${sessionId}`), {
          name: this.form.sessionName,
          ownerId: this.userId,
          isRevealed: false,
          currentVotingId: "",
          votingOptions: this.form.votingOptions
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
