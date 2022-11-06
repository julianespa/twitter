import React from "react";
import update from 'immutability-helper'
import config from '../config.js'
import propTypes from 'prop-types'
import {v4 as uuidV4} from 'uuid'

class Reply extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            focus: false,
            message: '',
            image: null
        }
    }

    handleMessageFocus(e) {
        let newState = update(this.state,{
            focus: {$set: true}
        })
        this.setState(newState)
    }

    handleChangeMessage(e) {
        this.setState(update(this.state,{
            message: {$set: e.target.value}
        }))
    }

    handleKeyDown(e) {
        //scape key
        if(e.keyCode === 27) {
            this.reset()
        }
    }
    reset(){
        let newState = update(this.state,{
            focus: {$set: false},
            message: {$set: ''},
            image: {$set: null}
        })
        this.setState(newState)
        this.reply.blur()
    }

    handleMessageFocusLost(e){
        if(this.state.message.length === 0){
            this.reset()
        }
    }

    imageSelect(e) {
        e.preventDefault()
        let reader = new FileReader()
        let file = e.target.files[0]
        if(file.size > 1240000) {
            alert('Image size above 1MB')
            return
        }

        reader.onloadend = () => {
            let newState = update(this.state,{
                image: {$set: reader.result}
            })
            this.setState(newState)
        }

        reader.readAsDataURL(file)
    }

    newTweet(e) {
        e.preventDefault()

        let tweet = {
            _id: uuidV4(),
            _creator: {
                _id: this.props.profile._id,
                name: this.props.profile.name,
                userName: this.props.profile.userName,
                avatar: this.props.profile.avatar
            },
            date: Date.now(),
            message: this.state.message,
            image:this.state.image,
            liked: false,
            likeCounter: 0
        }

        this.props.operations.addNewTweet(tweet)
        this.reset()
    }

    render(){
        let randomID = uuidV4()

        return(
            <section className="reply">
                <If condition={this.props.profile!=null}>
                    <img src={this.props.profile.avatar} className='reply-avatar' />  
                </If>
                <div className="reply-body">
                    <textarea
                        ref={self => this.reply = self}
                        name='message'
                        type='text'
                        maxLength={config.tweets.maxTweetSize}
                        placeholder='What are you thinking?'
                        className={this.state.focus ? 'reply-selected' : ''}
                        value={this.state.message}
                        onKeyDown={this.handleKeyDown.bind(this)}
                        onBlur={this.handleMessageFocusLost.bind(this)}
                        onFocus={this.handleMessageFocus.bind(this)}
                        onChange={this.handleChangeMessage.bind(this)}
                    />
                    <If condition={this.state.image!=null}>
                        <div className="image-box"><img src={this.state.image} /></div>
                    </If>
                </div>
                <div className={this.state.focus ? 'reply-controls' : 'hidden'}>
                    <label  htmlFor={'reply-camera-' + randomID} className={this.state.message.length === 0 ? 'btn pull-left disabled' : 'btn pull-left'}>
                        <i className="fa fa-camera fa-2x" aria-hidden='true'></i>
                    </label>

                    <input href='#' className={this.state.message.length === 0 ? 'btn pull-left disabled' : 'btn pull-left'} accept='.gif,.jpg,.jpeg,.png' type='file' onChange={this.imageSelect.bind(this)} id={'reply-camera-' + randomID}></input>

                    <span ref='charCounter' className="char-counter">{config.tweets.maxTweetSize - this.state.message.length}</span>

                    <button className={this.state.message.length === 0 ? 'btn btn-primary disabled' : 'btn btn-primary'} onClick={this.newTweet.bind(this)}>
                        <i className="fa fa-twitch" aria-hidden='true'></i>
                        Tweet
                    </button>
                </div>
            </section>
        )
    }
}

Reply.propTypes = {
    profile: propTypes.object,
    operations: propTypes.object.isRequired
}

export default Reply