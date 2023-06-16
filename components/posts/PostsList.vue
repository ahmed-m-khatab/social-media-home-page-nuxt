<template>
    <div>
        <scroll-cont :responsive="true" @onIntersect="onIntersect">
            <template #default>
                <div class="posts-cont">
                    <div v-if="$fetchState.pending">
                        <v-skeleton-loader
                        class="mb-5"
                        type="list-item-avatar-two-line, article, actions"
                        ></v-skeleton-loader>
                    </div>
                    <div v-else-if="$fetchState.error">
                        <h3>Sorry, Something went wrong!</h3>
                    </div>
                    <div v-else>
                        <posts-post-card v-for="(post, i) in posts" :key="i" :post="post" />
                    </div>

                    <!-- end of posts note -->
                    <p v-if="endOfPosts" class="mx-auto text-center mt-1">No New Posts!</p>
                </div>
            </template>
        </scroll-cont>

        <!-- circle progress while loading more posts -->
        <v-progress-circular
        v-if="postsLoading"
        indeterminate
        color="primary"
        class="d-block mx-auto"
        ></v-progress-circular>
    </div>
</template>

<script>
// import posts endpoints
import { posts, userPosts } from '../../web-services/posts.js'

export default {
    data: () => ({
        posts: [],
        postsLoading: false,
        endOfPosts: false
    }),

    // Get posts
    async fetch () {
        let results
        // posts arguments (limit, skip)
        // get posts for one user when the user id is in url param
        if (this.$route.params.id && this.$route.name === 'users-id') {
          results = await this.$axios.$get(userPosts(this.$route.params.id, 4, 0))
        } else results = await this.$axios.$get(posts(4, 0))
        this.endOfPosts = false
        this.posts = results.posts
        this.updatePostBody()
    },

    methods: {
        // add property for post caption 50 characters
        updatePostBody () {
        this.posts.forEach(post => {
            post.caption = post.body.substr(0, 50)
        })
        },

        async onIntersect (entries) {
            if (entries[0].isIntersecting) {
                if (this.posts.length < 30) {
                    let result
                    this.postsLoading = true
                    // Send limit of 1 post more and skip the items in the current posts array
                    try {
                        if (this.$route.params.id && this.$route.name === 'users-id') {
                          result = await this.$axios.$get(userPosts(this.$route.params.id, 1, this.posts.length))
                        } else result = await this.$axios.$get(posts(1, this.posts.length))
                        this.posts.push(...result.posts)
                        this.postsLoading = false
                        if (!result.posts.length) {
                            this.endOfPosts = true
                        }
                    } catch {
                        this.postsLoading = false
                        this.endOfPosts = true
                    }
                } else {
                    this.endOfPosts = true
                }
            }
        },
    }
}
</script>
  
