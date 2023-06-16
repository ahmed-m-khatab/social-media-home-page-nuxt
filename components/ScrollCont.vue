<template>
    <vue-custom-scrollbar
      class="px-5 py-0"
      :class="responsive ? 'scroll-area' : 'comment-scroll-area'"
      :settings="settings"
    >
        <slot></slot>

        <!-- intersection limit to load more posts -->
        <div v-if="responsive" v-intersect="intersected"></div>
    </vue-custom-scrollbar>
</template>

<script>
// import vue custom scroll bar plugin to beautify the posts container scrollbar
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"

export default {
    props: ['responsive'],
    components: {
        vueCustomScrollbar
    },
    data () {
        return {
            // scrollbar attributes
            settings: {
                suppressScrollY: false,
                suppressScrollX: true,
                wheelPropagation: true
            }
        }
    },
    methods: {
        intersected (entries, observer) {
            this.$emit('onIntersect', entries)
        }
    }
}
</script>