<template>
    <v-bottom-navigation
      :value="value"
      color="primary"
      grow
      class="mt-14 d-flex d-md-none"
    >
      <v-btn>
        <v-icon>mdi-home</v-icon>
      </v-btn>
  
      <v-btn>  
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
  
      <v-btn>
        <v-icon>mdi-video</v-icon>
      </v-btn>
    </v-bottom-navigation>
</template>

<script>
export default {
  data () {
    return {
      value: 1
    }
  }
}
</script>