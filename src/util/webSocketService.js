import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";
import env from "@/env.js";
const webSocketService = sailsIOClient(socketIOClient);
webSocketService.sails.url = env.web_service_url;
export default webSocketService;
