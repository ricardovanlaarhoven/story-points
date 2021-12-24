<template>
  <v-app>
    <v-main class="blue lighten-5">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { authentication } from "@/plugins/authentication";
import { mapMutations } from "vuex";

export default Vue.extend({
  name: "App",
  created() {
    signInAnonymously(authentication);
    onAuthStateChanged(authentication, user => {
      if (user) {
        this.setUserId(user.uid);
      } else {
        throw "An anonymous user should never be logged out";
      }
    });
  },
  methods: {
    ...mapMutations(["setUserId"])
  }
});
</script>
