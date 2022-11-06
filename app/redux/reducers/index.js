import { combineReducers } from "redux";
import userPageReducer from './userPageReducer'
import tweetsReducer from './tweetsReducer'

export default combineReducers({
    userPage: userPageReducer,
    tweets: tweetsReducer
})