import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import RequestService from '@/js/RequestService'

import env from "@/js/env.js"

import getWeb3 from '@/util/getWeb3'

import getContract from '@/util/getContracts'

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
        registerWeb3Instance(state, payload) {
            console.log('registerWeb3instance Mutation being executed', payload)
            let result = payload
            let web3Copy = state.web3
            web3Copy.coinbase = result.coinbase
            web3Copy.networkId = result.networkId
            web3Copy.balance = parseInt(result.balance, 10)
            web3Copy.isInjected = result.injectedWeb3
            web3Copy.web3Instance = result.web3
            state.web3 = web3Copy

            console.log(state.web3)
        },
        registerContractInstance(state, payload) {
            console.log(`Tipping contract instance: `, payload)
            state.contractInstance = () => payload
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

        }

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
        registerWeb3({ commit }) {
            console.log('registerWeb3 Action being executed')
            getWeb3.then(result => {
                console.log('committing result to registerWeb3Instance mutation')
                commit('setMyWalletAddress', result.coinbase)
                commit('registerWeb3Instance', result)
            }).catch(e => {
                console.log('error in action registerWeb3', e)
            })
        },
        getContractInstance({ commit }) {
            getContract.then(result => {
                commit("registerContractInstance", result)
            }).catch(e => console.log(e))
        },
        async update({ state }, model) {

            let response = await RequestService.update(model, state)

            return response;

        },



    }
})
