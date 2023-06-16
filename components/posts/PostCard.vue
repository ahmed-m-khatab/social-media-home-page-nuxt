<template>
  <v-card class="mb-5 pa-5 rounded-xl">
    <v-snackbar
      v-model="showMessage"
      timeout="3000"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          icon
          v-bind="attrs"
          @click="showMessage = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-row no-gutters justify="space-between">
      <nuxt-link v-if="postUser" :to="'/users/'+postUser.id" target="_blank" class="d-flex align-center clickable text-decoration-none">
          <v-avatar size="40" color="primary">
              <img
              :src="postUser.image"
              >
          </v-avatar>
          <div class="mx-2 ">
            <span class="body-2">{{postUser.firstName + ' ' + postUser.lastName}}</span>
            <br />
            <span class="caption">{{ '@' + postUser.username + ' 30m ago' }}</span>
          </div>
      </nuxt-link>
      <div v-else>
        <v-skeleton-loader
          max-width="150"
          type="list-item-avatar"
        ></v-skeleton-loader>
      </div>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="primary" dark v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-bookmark-minus-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Save Post</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-close-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Remove Post</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>

    <v-card-title>
      {{ post.title }}
    </v-card-title>
    
    <v-card-text>
      <v-chip-group
        column
      >
        <v-chip
          small
          v-for="tag in post.tags"
          :key="tag"
        >
          {{ tag }}
        </v-chip>
      </v-chip-group>

      <article>
        <span v-if="showFullPostBody">
          {{ post.body }}
          <v-btn text small @click="showFullPostBody = false" class="text-lowercase">show less</v-btn>
        </span>
        <span v-else>
          {{ post.caption }}
          <v-btn text small @click="showFullPostBody = true" class="text-lowercase px-0">...show more</v-btn>
        </span>
      </article>
    </v-card-text>

    <v-divider />
    <!-- actions section -->
    <div class="d-flex justify-space-between align-center">
      <!-- reactions -->
      <v-btn text small @click="likePost">
        {{post.reactions}}
        <v-icon small right :color="liked ? 'red' : ''">
          {{liked ? 'mdi-heart' : 'mdi-heart-outline'}}
        </v-icon>
      </v-btn>

      <!-- comments -->
      <v-btn text small @click="showCommentAddBox = !showCommentAddBox">
        <v-icon left small>mdi-comment-outline</v-icon>
        {{comments.length ? comments.length + ' Comments' : 'Comment'}}
      </v-btn>

      <!-- share -->
      <v-dialog
        v-model="shareDialog"
        max-width="300"
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-text-field
            height="40"
            hide-details
            outlined
            readonly
            value="https://ahmed-khatab.onrender.com"
          >
            <template #append>
              <v-icon @click="shareDialog = false; message = 'Link Copied!'; showMessage = true;" class="mt-1" color="#999">
                mdi-content-copy
              </v-icon>
            </template>
          </v-text-field>
        </v-card>
      </v-dialog>
    </div>

    <v-divider />

    <v-card-text class="px-0 pb-0">
      <!-- view more comments button -->
      <v-btn text x-small color="primary" class="mb-2" :loading="viewMoreCommentsBtnLoad" @click="getMoreComments">View more comments</v-btn>

      <!-- comments -->
      <scroll-cont v-if="comments.length" id="comments-cont">
        <div v-for="(item, i) in comments" :key="item.id">
          <posts-comment-card :comment="item" /> 
          <v-divider class="my-2" />   
        </div>
      </scroll-cont>

      <!-- skeleton for comments -->
      <div v-else-if="$fetchState.pending">
        <v-skeleton-loader
          type="list-item-avatar-three-line"
        ></v-skeleton-loader>
      </div>

      <!-- add comment -->
      <v-fade-transition>
        <div v-show="showCommentAddBox">
          <v-text-field
          rounded
          dense
          append-icon="mdi-send"
          @click:append="addComment"
          v-model="comment.body"
          placeholder="Write a comment"
          outlined
          hide-details
          class="w-100 mt-3"
          @keyup.enter.prevent="addComment"
          >
            <template #prepend>
              <v-avatar size="30" color="primary" class="ma-0">
                <img :src="user.image" :alt="user.firstName">
              </v-avatar>
            </template>
          </v-text-field>
        </div>
      </v-fade-transition>
    </v-card-text>
  </v-card>
</template>

<script>
// import post user and comments endpoints
import { getUser } from '../../web-services/users.js'
import { postComments } from '../../web-services/posts.js'

export default {
  props: ['post'],
  data: () => ({
    comments: [],
    comment: {
      id: 0,
      body: '',
      postId: 0,
      user: {
        id: 1
      }
    },
    liked: false,
    postUser: null,
    shareDialog: false,
    showMessage: false,
    message: '',
    showFullPostBody: false,
    showCommentAddBox: false,
    viewMoreCommentsBtnLoad: false,
  }),

  computed: {
    user () {
      return this.$store.state.user
    }
  },

  // Get post user and comments
  async fetch () {
    this.postUser = await this.$axios.$get(getUser(this.post.userId))
    
    // comments endpoint arguments (postId, limit, skip)
    const results = await this.$axios.$get(postComments(this.post.userId, 2, 0))
    this.comments = results.comments
  },

  methods: {
    likePost () {
      if (this.liked) {
        this.post.reactions--
        this.liked = false
      } else {
        this.post.reactions++
        this.liked = true
      }
    },

    // get more comments for the post
    async getMoreComments () {
      this.viewMoreCommentsBtnLoad = true
      // Send limit of 3 comments more and skip the items in the current comments array
      const results = await this.$axios.$get(postComments(this.post.userId, 3, this.comments.length))
      this.comments.push(...results.comments)
      this.viewMoreCommentsBtnLoad = false
      if (!results.comments.length) {
        this.showMessage = true
        this.message = 'No more comments to show!'
      }
    },

    addComment () {
      if (this.comment.body) {
        this.comment.id = this.comments.length ? this.comments[0].id - 1 : -1
        this.comment.postId = this.post.id
        this.comments.unshift(this.comment)
        this.comment = {
          id: 0,
          body: '',
          postId: 0,
          user: {
            id: 1
          }
        }
        document.getElementById('comments-cont').scrollTo(0, 0)
      }
    }
  }
}
</script>
