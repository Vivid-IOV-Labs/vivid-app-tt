import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)


//THIS VUEX 'STORE' HAS BEEN CREATED TO ACT AS A CENTRAL PALCE TO 
//SAVE INFORMATION THAT CAN BE MADE AVAILABLE TO EVERY COMPONENT IN THE VUE APP.
export default new Vuex.Store({
    // plugins: [createPersistedState()],
    state: {
        inBuiltRequestDemo: true

    },
    mutations: {
        setInBuiltRequestDemo(state, n) {
            state.inBuiltRequestDemo = n
        }

    },
    getters: {
        isInBuiltRequestDemo: state => state.inBuiltRequestDemo


    }
})
