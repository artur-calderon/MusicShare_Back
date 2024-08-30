import {serverHttp} from "./Http.js";
import './socket.js'
const port = process.env.PORT || 3000;
serverHttp.listen(port, () => console.log("Running..."));
