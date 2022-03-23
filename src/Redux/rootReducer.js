import auth from "./slices/auth";
import registerReducer from "./slices/registerReducer";

const rootReducer={
 register:registerReducer,
 auth:auth
}
export default rootReducer;