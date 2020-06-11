import Api from '@/js/api.js'

// export default {
//     saveForm (params,store) {
//         return Api(store).post(store.state.orgID +"/forms/save", params)
//     }
// }

export default {
    find_all_requests(params, state) {
        return Api(state).post("request/find/addresses/", params)
    },
    add(params, state) {
        return Api(state).post("request/add/", params)
    },
    get_requests(state) {
        return Api(state).get("request/find/all/")
    },
    // getUsers(params, state) {
    //     return Api(state).get(state.orgID + "/user/list/", params)
    // },
    // updateFormAccess(params, state) {
    //     return Api(state).post(state.orgID + "/formaccess/update/", params)
    // },
    // createFormAccess(params, state) {
    //     return Api(state).post(state.orgID + "/formaccess/create/", params)
    // },
    // getFormUserAccessList(params, state) {
    //     return Api(state).post(state.orgID + "/formaccess/list/", params)
    // }
}