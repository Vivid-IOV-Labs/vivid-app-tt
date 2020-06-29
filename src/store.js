import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import RequestService from '@/js/RequestService'

import env from "@/js/env.js"

import getWeb3 from '@/util/getWeb3'


Vue.use(Vuex)

//THIS VUEX 'STORE' HAS BEEN CREATED TO ACT AS A CENTRAL PALCE TO 
//SAVE INFORMATION THAT CAN BE MADE AVAILABLE TO EVERY COMPONENT IN THE VUE APP.
export default new Vuex.Store({
    // plugins: [createPersistedState()],
    state: {
        inBuiltRequestDemo: true,
        //baseURL: 'http://127.0.0.1:1336/',
        baseURL: env.web_service_url,
        myWalletAddress: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
        localCopyOfRequestPins: null,
        selectedPin: null,
        streamerWalletAddress: null,
        web3: {
            isInjected: false,
            web3Instance: null,
            networkId: null,
            coinbase: null,
            balance: null,
            error: null
        },
        contractInstance: null

    },
    mutations: {
        setInBuiltRequestDemo(state, n) {
            state.inBuiltRequestDemo = n

        },
        setLocalCopyOfRequestPins(state, n) {
            state.localCopyOfRequestPins = n

        },
        setSelectedPin(state, n) {
            state.selectedPin = n

        },
        setMyWalletAddress(state, n) {
            state.myWalletAddress = n

        },
        setStreamerWalletAddress(state, n) {
            state.streamerWalletAddress = n

        },
        setCoinbase(state, n) {
            state.web3.coinbase = n

        },
        setNetworkID(state, n) {
            state.web3.networkId = n

        },
        setBalance(state, n) {
            state.web3.balance = parseInt(n, 10)

        },
        setIsInjected(state, n) {
            state.web3.isInjected = n

        },
        setWeb3Instance(state, n) {
            state.web3.web3Instance = n

        },

    },
    getters: {
        isInBuiltRequestDemo: state => state.inBuiltRequestDemo,
        myWalletAddress: state => state.myWalletAddress,
        getLocalCopyOfRequestPins: state => state.localCopyOfRequestPins,
        getSelectedPin: state => state.selectedPin,
        getStreamerWalletAddress: state => state.streamerWalletAddress,


    },
    actions: {
        async find_all_requests({ state }) {

            const response = await RequestService.find_all_requests({

            }, state)

            return response;
        },
        async add({ state }, model) {

            const response = await RequestService.add(model, state)

            return response;
        },
        async get_requests({ state }) {

            const response = await RequestService.get_requests(state)

            return response;
        },
        async create({ state }, model) {
            let response;

            let findWhereModel = { "openLocationCode": model.openLocationCode }
            const findWhereResponse = await RequestService.findWhere(findWhereModel, state)

            if (!(findWhereResponse.data && findWhereResponse.data.length)) {
                response = await RequestService.create(model, state)

            } else {
                response = "already exists"
                console.log(response)
            }
            return response;

        },
        registerWeb3Instance2({ commit }, payload) {
            commit('setCoinbase', payload.coinbase)
            commit('setNetworkID', payload.networkId)
            commit('setBalance', payload.balance)
            commit('setIsInjected', payload.injectedWeb3)
            commit('setWeb3Instance', payload.web3)

        },
        registerWeb3({ commit, dispatch }) {
            console.log('registerWeb3 Action being executed')
            getWeb3.then(result => {
                console.log('committing result to registerWeb3Instance mutation')
                console.log(result.coinbase)
                commit('setMyWalletAddress', result.coinbase)
                //commit('registerWeb3Instance', result)
                dispatch('registerWeb3Instance2', result)
                console.log(result)
            }).catch(e => {
                console.log('error in action registerWeb3', e)
            })
        },
        async update({ state }, model) {

            let response = await RequestService.update(model, state)

            return response;

        },



    }
})
