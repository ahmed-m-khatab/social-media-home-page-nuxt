<template>
  <v-app>
    <v-app-bar
      fixed
      app
      elevate-on-scroll
    >
      <div class="d-flex justify-space-between align-center w-100">    
        <div class="d-flex align-center">
          <!-- logo -->
          <v-avatar
            color="#222"
            size="40"
          >
            <span class="white--text text-h5">S</span>
          </v-avatar>

          <!-- Search menu for tab and up screen sizes -->
          <v-text-field
            placeholder="Search..."
            rounded
            outlined
            dense
            height="40"
            hide-details
            class="d-none d-sm-block ml-5"
          >
            <template #append>
              <v-icon class="mt-1" :color="isDark ? '#999' : '#222'">
                mdi-magnify
              </v-icon>
            </template>
          </v-text-field>

          <!-- Search menu for small screen sizes -->
          <v-menu offset-y :close-on-content-click="false">
            <template #activator="{ on }">
              <v-btn
                class="ml-5 grey--text d-block d-sm-none"
                outlined
                dark
                small
                color="#333"
                elevation="0"
                v-on="on"
                rounded
                height="40"
              >
                <v-icon dark left>
                  mdi-magnify
                </v-icon>
                Search...
              </v-btn>
            </template>
            <v-card>
              <v-text-field
                placeholder="Search..."
                rounded
                height="40"
                hide-details
              >
                <template #append>
                  <v-icon class="mt-1" color="#999">
                    mdi-magnify
                  </v-icon>
                </template>
              </v-text-field>
            </v-card>
          </v-menu>

          <v-btn class="mx-2" small icon :color="isDark ? 'warning' : '#666'" @click="isDark = !isDark">
            <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
        </div>

        <!-- Actions -->
        <div class="d-flex align-center">
          <notification-list type="chat" />

          <notification-list type="notification" />

          <v-menu offset-y v-if="user">
            <template #activator="{ on }">
              <v-avatar v-on="on" color="blue" size="40" class="ml-5">
                <img
                  :src="user.image"
                  :alt="user.firstName"
                >
              </v-avatar>
            </template>
            <v-list>
              <v-list-item link exact to="#">
                <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item link exact to="#">
                <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-skeleton-loader
            v-else
            type="avatar"
          />
        </div>
      </div>
    </v-app-bar>

    <mobile-navigation />

    <v-main class="py-5 mt-md-10">
      <v-container fluid>
        <v-row>
          <!-- navigation and chats -->
          <v-col cols="0" md="3" class="d-none d-md-block">
            <v-card class="rounded-xl pb-5 mb-5" :elevation="isDark ? 0 : 2">
              <v-subheader>Quick Access</v-subheader>
      
              <v-list rounded dense>
                <v-list-item-group
                  v-model="selectedItem"
                  color="primary"
                >
                  <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
      
            <dummy-list type="chat" />
          </v-col>

          <!-- posts -->
          <v-col cols="12" md="6">
            <Nuxt />
          </v-col>

          <!-- groups and people -->
          <v-col cols="3"  class="d-none d-md-block">
            <dummy-list type="people" />
      
            <dummy-list type="groups" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      selectedItem: 0,
      items: [
        { text: 'Home', icon: 'mdi-home' },
        { text: 'Groups', icon: 'mdi-account-multiple' },
        { text: 'Watch', icon: 'mdi-video' },
      ],
      isDark: true
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    isDark (val) {
      this.$vuetify.theme.dark = val
    }
  },
  created () {
    this.$vuetify.theme.dark = true
    if (!this.$store.state.user) this.$store.dispatch('Set_User')
  }
}
</script>
