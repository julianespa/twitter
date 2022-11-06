import React, {useState, useEffect} from "react";
import UserCard from "./UserCard";
import APIInvoker from "./utils/APIInvoker";
import propTypes from 'prop-types'
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { loadFollowers } from "./redux/actions/userPageActions";

const Followers = (props) => {
    
    const dispath = useDispatch()
    const state = useSelector(state => state.userPage.followers)

    useEffect(() => {
      if(state === null) {
        dispath(loadFollowers())
      }
    }, [props.profile.userName])
    

    return(
        <section>
            <div className="container-fluid no-padding">
                <div className="row no-padding">
                    {/* <CSSTransition 
                        transitionName="card"
                        transitionEnter = {true}
                        transitionEnterTimeout = {500}
                        transitionAppear = {false}
                        transitionAppearTimeout = {0}
                        transitionLeave = {false}
                        transitionLeaveTimeout = {0} > */}
                        <For each="user" of={state || []}>
                            <div className="col-xs-12 col-sm-6 col-lg-4" key={user._id}>
                                <UserCard user = {user} />
                            </div>
                        </For>
                    {/* </CSSTransition> */}
                </div>
            </div>
        </section>
    )
}

Followers.propTypes = {
    profile: propTypes.object
}

export default Followers