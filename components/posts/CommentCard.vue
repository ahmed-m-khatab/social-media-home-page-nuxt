<template>
    <v-card flat>
        <div>
            <nuxt-link v-if="commentUser" :to="'/users/'+commentUser.id" target="_blank" class="d-flex align-center clickable text-decoration-none">
                <v-avatar size="30" color="primary">
                    <img
                    :src="commentUser.image"
                    >
                </v-avatar>
                <div class="mx-2 ">
                  <span class="body-2">{{ commentUser.firstName + ' ' + commentUser.lastName }}</span>
                  <br />
                  <span class="caption">{{ '@' + commentUser.username }}</span>
                </div>
            </nuxt-link>
            <div v-else>
              <v-skeleton-loader
                max-width="150"
                type="list-item-avatar"
              ></v-skeleton-loader>
            </div>
        </div>
        <v-card-text class="pl-10 py-2">{{comment.body}}</v-card-text>
    </v-card>
</template>

<script>
// import comment user endpoint
import { getUser } from '../../web-services/users.js'

export default {
    props: ['comment'],
    data () {
        return {
            commentUser: null
        }
    },

    // Get comment user
    async fetch () {
        this.commentUser = await this.$axios.$get(getUser(this.comment.user.id))
    }
}
</script>
