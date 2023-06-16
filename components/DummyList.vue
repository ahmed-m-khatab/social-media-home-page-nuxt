<template>
    <v-card class="rounded-xl mb-5" :elevation="$vuetify.theme.dark ? 0 : 2">
        <v-list subheader>
            <v-subheader>
                {{ type === 'groups' ? 'Popular Groups' : (type === 'chat' ? 'Recent Chats' : 'People you may know') }}
            </v-subheader>

            <v-list-item
            v-for="chat in recent"
            :key="chat.title"
            link
            >
                <v-list-item-avatar>
                    <v-img
                    :alt="`${chat.title} avatar`"
                    :src="chat.avatar"
                    ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title v-text="chat.title"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon v-if="type === 'groups'">
                    <v-icon color="primary">
                    mdi-chevron-right
                    </v-icon>
                </v-list-item-icon>

                <v-list-item-icon v-else-if="type === 'chat'">
                    <v-icon color="primary">
                    mdi-message-outline
                    </v-icon>
                </v-list-item-icon>

                <v-list-item-icon v-else>
                    <v-icon color="primary" class="mr-3">
                    mdi-account-plus
                    </v-icon>
                    <v-icon color="primary">
                        mdi-message-outline
                    </v-icon>
                </v-list-item-icon>
            </v-list-item>
        </v-list>

        <v-list subheader ribble v-if="type === 'chat'">
            <v-subheader>Previous chats</v-subheader>
  
            <v-list-item
              v-for="chat in previous"
              :key="chat.title"
              link
            >
              <v-list-item-avatar>
                <v-img
                  :alt="`${chat.title} avatar`"
                  :src="chat.avatar"
                ></v-img>
              </v-list-item-avatar>
  
              <v-list-item-content>
                <v-list-item-title v-text="chat.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
export default {
  props: ['type'],
  data () {
    return {
      recent: [
        {
          active: true,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Jason Oner',
        },
        {
          active: true,
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Mike Carlson',
        },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Cindy Baker',
        },
      ],
      previous: [{
        title: 'Travis Howard',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
      }]
    }
  }
}
</script>
