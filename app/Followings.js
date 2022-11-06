import React, {useState, useEffect} from "react";
import UserCard from "./UserCard";
import APIInvoker from "./utils/APIInvoker";
import propTypes from 'prop-types'
import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";
import { loadFollowings } from "./redux/actions/userPageActions";


const Followings = (props) => {

    useEffect(()=>{
        if(props.state === null) {
            props.loadFollowings()
        }
    },[props.profile.userName])

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
                        <For each="user" of={props.state || []}>
                            <div className="col-xs-12 col-sm-6 col-lg-4" key={user.id}>
                                <UserCard user = {user} />
                            </div>
                        </For>
                    {/* </CSSTransition> */}
                </div>
            </div>
        </section>
    )  
}

Followings.propTypes = {
    profile: propTypes.object
}

function mapStateToProps(state) {
    return {
        state: state.userPage.followings
    }
}

export default connect(mapStateToProps, {loadFollowings})(Followings)