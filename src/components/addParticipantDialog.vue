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
          <VTextField label="name" hint="whats your name?" v-model="name"/>
        </v-card-text>
        <v-card-actions justify="end">
          <v-btn type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import {child, push, ref, set} from 'firebase/database';
import {realtimeDatabase} from '@/plugins/realtimeDatabase.ts';
import {mapMutations} from "vuex";

export default {
  name: 'addParticipantDialog',
  data: () => ({
    name: '',
  }),
  props: {
    sessionId: {
      type: String,
      required: true,
    }
  },
  methods: {
    ...mapMutations(['setParticipantId']),
    save(): void {
      this.addParticipant(this.name);
    },
    addParticipant(name: string): void {
      const participantId = push(child(ref(realtimeDatabase), 'sessions')).key;
      set(ref(realtimeDatabase, `sessions/${this.sessionId}/participants/${participantId}`), {
        name: name,
      });
      this.setParticipantId({participantId, sessionId: this.sessionId})
      console.log(name, this.sessionId, participantId)
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
