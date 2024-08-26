import {serverHttp} from "./Http.js";
import './socket.js'

serverHttp.listen(3001, () => console.log("Running..."));
