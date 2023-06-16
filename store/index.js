export const state = () => ({
    user: null
})

export const mutations = {
    Set_User (state, userData) {
        state.user = userData
    }
}

export const actions = {
    // get fake user as the current logged user
    async Set_User ({ commit }) {
        const userData = await this.$axios.$get('/user/1')
        commit('Set_User', userData)
    }
}