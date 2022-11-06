import React from "react";
import APIInvoker from './utils/APIInvoker'
import browserHistory from './History'
import history from "./History";
import { Route, Routes, Navigate, BrowserRouter, useParams, useOutletContext } from 'react-router-dom'
import Signup from './Signup'
import Login from "./Login";
import {TwitterDashboard} from "./TwitterDashboard.js";
import Toolbar from "./Toolbar";
import UserPage from "./UserPage";
import Mytweets from "./MyTweets";
import Followings from "./Followings";
import Followers from "./Followers";
import TweetDetail from "./TweetDetail";
import Modal from "./Modal";
import userContext from "./context/UserContext";
import useLogin from './hooks/useLogin.js'
import { Provider } from "react-redux";
import store from './redux/store'

const TwitterApp = (props) => {

    const [load, user] = useLogin()

    const render = () => {

        const Wrapper = (props) => {
            const params = useParams();
            return <UserPage {...{...props, match: {params}} } />
        }

        const WrapperDetail = (props) => {
            const params = useParams();
            return <Modal><TweetDetail {...{...props, match: {params}} } /></Modal>
        }

        const WrapperTweets = (props) => {
            const {profile} = useOutletContext();
            console.log(profile)
            
            return <Mytweets profile={profile} />
        }

        const WrapperFollowings = (props) => {
            const {profile} = useOutletContext();
            console.log(profile)
            
            return <Followings profile={profile} />
        }

        const WrapperFollowers = (props) => {
            const {profile} = useOutletContext();
            console.log(profile)
            
            return <Followers profile={profile} />
        }

        if(!load){ return null }

        return(
            <>
            <BrowserRouter history={history}>
            <userContext.Provider value={user}>
            <Provider store={store}>
                <Toolbar />
                <div id='mainApp' className='animate fadeIn'>
                    <Routes>
                        <Route exact path='/' element={ user != null ? <TwitterDashboard /> : <Navigate to='/login' />} />
                        <Route exact path='/signup' element={<Signup />} />
                        <Route exact path='/login' element={ user == null ? <Login /> : <Navigate to='/' />} />
                        <Route path="/:user" element={<Wrapper />} >
                            <Route exact path="/:user" element={<WrapperTweets /*profile={this.state.profile}*/ />}/>
                            <Route exact path="/:user/following" element={<WrapperFollowings /*profile={this.state.profile}*/ />}/>
                            <Route exact path="/:user/followers" element={<WrapperFollowers /*profile={this.state.profile}*/ />}/>
                        </Route>
                        <Route exact path="/:user/:tweet" element={<WrapperDetail />} />
                    </Routes>
                    <div id="dialog" />
                </div>
            </Provider>
            </userContext.Provider>
            </BrowserRouter>
            </>
        )
    }

    return render()
}

export default TwitterApp