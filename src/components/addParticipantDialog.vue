<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    v-bind="$attrs"
    persistent
  >
    <v-form @submit.prevent="save">
      <v-card>
        <v-card-title>
          Join session
        </v-card-title>
        <v-card-text>
          <p class="text-body-1">
            Please enter the name you want to use for yourself for this session.
          </p>
          <v-row>
            <v-col>
              <VTextField label="name" hint="whats your name?" v-model="name" />
              <v-btn
                v-for="colorOption in colors"
                :key="colorOption"
                icon
                @click="color = colorOption"
                class="mx-1"
                :style="`background-color: ${colorOption};`"
                width="30px"
                height="30px"
              ></v-btn>
            </v-col>
            <v-col class="pt-12">
              <div class="player" :style="`background-color: ${color}`">
                <div class="player--name font-weight-bold">
                  <v-icon>mdi-account</v-icon>{{ name || "Player" }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn type="submit" color="primary">Join</v-btn>
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
  color: string;
}

export default Vue.extend({
  name: "addParticipantDialog",
  data: (): componentData => ({
    name: "",
    color: "#FC9918"
  }),
  props: {
    sessionId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(["userId"]),
    colors() {
      return [
        "#FC9918",
        "#676FA3",
        "#35589A",
        "#F14A16",
        "#FF5959",
        "#105652",
        "#B24080"
      ];
    }
  },
  methods: {
    save(): void {
      this.addParticipant({ name: this.name, color: this.color }, this.userId);
    },
    addParticipant(data: Record<string, unknown>, userId: string): void {
      set(
        ref(
          realtimeDatabase,
          `sessions/${this.sessionId}/participants/${userId}`
        ),
        data
      );
    }
  }
});
</script>

<style lang="scss" scoped></style>
