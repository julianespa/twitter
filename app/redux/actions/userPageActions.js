import APIInvoker from "../../utils/APIInvoker";
import {
    USERPAGE_RESET,
    LOAD_USERPROFILE,
    LOAD_FOLLOWERS,
    LOAD_FOLLOWINGS,
    TOGGLE_EDIT_MODE,
    FOLLOW_USER,
    EDIT_PROFILE,
    SAVE_PROFILE
} from '../consts'

export const loadProfile = (username) => (dispatch, getState) => {
    APIInvoker.invokeGET(`/profile/${username}`, response => {
        dispatch({
            type: LOAD_USERPROFILE,
            value: response.body
        })
    }, error => {
        console.log('load user error')
        window.location = '/'
    })
}

export const rest = () => (dispatch, getState) => {
    dispatch({ type: USERPAGE_RESET })
}

export const follow = () => (dispatch, getState) => {
    let request = {
        followingUser: getState().userPage.profile.userName
    }
    APIInvoker.invokePOST('/secure/follow', request, response => {
        if(response.ok) {
            dispatch({
                type: FOLLOW_USER,
                value: !response.unfollow
            })
        }
    }, error => {
        console.log('follow error')
    })
}

export const toggleEditMode = () => (dispatch, getState) => {
    dispatch({
        type: TOGGLE_EDIT_MODE
    })
}

export const handleInput = (field, value) => (dispatch, getState) => {
    dispatch({
        type: EDIT_PROFILE,
        value: {
            id: field,
            value
        }
    })
}

export const save = () => (dispatch, getState) => {
    const profile = getState().userPage.profile

    let request = {
        username: profile.userName,
        name: profile.name,
        description: profile.description,
        avatar: profile.avatar,
        banner: profile.banner
    }

    APIInvoker.invokePUT('/secure/profile', request, response => {
        dispatch({
            type: SAVE_PROFILE
        })
    }, error => {
        console.log('update profile error')
    })
}

export const loadFollowers = () => (dispatch, getState) => {
    let username = getState().userPage.profile.userName
    APIInvoker.invokeGET(`/followers/${username}`, response => {
        dispatch({
            type: LOAD_FOLLOWERS,
            value: response.body
        })
    }, error => {
        console.log('error getting followers')
    })
} 

export const loadFollowings = () => (dispatch, getState) => {
    let username = getState().userPage.profile.userName
    APIInvoker.invokeGET(`/followings/${username}`, response => {
        dispatch({
            type: LOAD_FOLLOWINGS,
            value: response.body
        })
    }, error => {
        console.log('error getting followings')
    })
}