import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import RequestService from '@/js/RequestService'

Vue.use(Vuex)


//THIS VUEX 'STORE' HAS BEEN CREATED TO ACT AS A CENTRAL PALCE TO 
//SAVE INFORMATION THAT CAN BE MADE AVAILABLE TO EVERY COMPONENT IN THE VUE APP.
export default new Vuex.Store({
    // plugins: [createPersistedState()],
    state: {
        inBuiltRequestDemo: true,
        baseURL: 'http://127.0.0.1:1336/',
        myWalletAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
        isConnected: false,
        socketMessage: '',

    },
    mutations: {
        setInBuiltRequestDemo(state, n) {
            state.inBuiltRequestDemo = n
        },
        // SOCKET_CONNECT(state) {
        //     state.isConnected = true;
        // },

        // SOCKET_DISCONNECT(state) {
        //     state.isConnected = false;
        // },

        // SOCKET_MESSAGECHANNEL(state, message) {
        //     state.socketMessage = message
        // }

    },
    getters: {
        isInBuiltRequestDemo: state => state.inBuiltRequestDemo,
        myWalletAddress: state => state.myWalletAddress,
        isConnected: state => state.isConnected,


    },
    actions: {
        async find_all_requests({ state }) {

            const response = await RequestService.find_all_requests({
                // SendCodedInputData: [model],
                StartItem: 0,
                EndItem: 0,
                FunctionEnd: 1156,
                FunctionRunText: "SingleTest",
                //userid: state.userID
            }, state)

            //console.log(response)

            return response;
        },
        async add({ state }, model) {

            console.log(model)

            const response = await RequestService.add(model, state)

            return response;
        },
        async get_requests({ state }) {

            const response = await RequestService.get_requests(state)

            return response;
        },

    }
})
