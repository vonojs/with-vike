import {RequestHandler} from "itty-router";

const ping: RequestHandler = async () => ({ message: "pong" })

export default ping;