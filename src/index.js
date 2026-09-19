import "./styles.css";
import { init, setCommitHandler}  from "./data/state.js";
import { save, load } from "./data/storage.js";

setCommitHandler(save);
init(load());