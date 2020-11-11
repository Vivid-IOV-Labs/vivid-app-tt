import axios from "axios";

export default state => {
  return axios.create({
    baseURL: state.baseURL
    //withCredentials: false,
    // headers: {
    //     Authorization: "JWT " + state.token
    // }
  });
};
