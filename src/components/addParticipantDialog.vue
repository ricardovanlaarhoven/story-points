<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    v-bind="$attrs"
    persistent
  >
    <v-form @submit.prevent="save">
      <v-card>
        <v-card-text>
          <VTextField label="name" hint="whats your name?" v-model="name" />
        </v-card-text>
        <v-card-actions justify="end">
          <v-btn type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { child, push, ref, set } from "firebase/database";
import { realtimeDatabase } from "@/plugins/realtimeDatabase.ts";
import { mapState } from "vuex";
import Vue from "vue";

interface componentData {
  name: string;
}

export default Vue.extend({
  name: "addParticipantDialog",
  data: (): componentData => ({
    name: ""
  }),
  props: {
    sessionId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    save(): void {
      this.addParticipant(this.name, this.userId);
    },
    addParticipant(name: string, userId: string): void {
      set(
        ref(
          realtimeDatabase,
          `sessions/${this.sessionId}/participants/${userId}`
        ),
        {
          name: name
        }
      );
    }
  }
});
</script>

<style lang="scss" scoped></style>
