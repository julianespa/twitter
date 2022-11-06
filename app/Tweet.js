import React from "react";
import propTypes from 'prop-types'
import { Link } from "react-router-dom";
import history from "./History";
import APIInvoker from "./utils/APIInvoker";
import update from 'immutability-helper'

class Tweet extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        tweet: props.tweet,
        showDialog: false
      }
    }
  
    handleClick(e) {
      if (this.props.detail || e.target.getAttribute("data-ignore-onclick")) {
        return
      }
  
      let url = `/${this.state.tweet._creator.userName}/${this.state.tweet._id}`
      history.push(url)
      window.location = url
    }
  
    handleLike(e) {
      e.preventDefault()
      let request = {
        tweetID: this.state.tweet._id,
        like: !this.state.tweet.liked
      }
  
      APIInvoker.invokePOST('/secure/like', request, response => {
        let newState = update(this.state, {
          tweet: {
            likeCounter: { $set: response.body.likeCounter },
            liked: { $apply: (x) => { return !x } }
          }
        })
        this.setState(newState)
      }, error => {
        console.log("Error al actualizar el Tweet", error);
      })
    }
  
  
  
    render() {
      let tweetClass = null
      if (this.props.detail) {
        tweetClass = 'tweet detail'
      } else {
        tweetClass = this.state.tweet.isNew ? 'tweet fadeIn animated' : 'tweet'
      }
  
      return (
        <article className={tweetClass} id={"tweet-" + this.state.tweet._id} onClick={this.handleClick.bind(this)} >
          <img src={this.state.tweet._creator.avatar} className="tweet-avatar" />
          <div className="tweet-body">
            <div className="tweet-user">
              <Link to={`/${this.state.tweet._creator.userName}`}>
                <span className="tweet-name" data-ignore-onclick>
                  {this.state.tweet._creator.name}</span>
              </Link>
              <Link to={`/${this.state.tweet._creator.userName}`}>
                <span className="tweet-username">
                  @{this.state.tweet._creator.userName}</span>
              </Link>
            </div>
            <p className="tweet-message">{this.state.tweet.message}</p>
            <If condition={this.state.tweet.image != null}>
              <img className="tweet-img" src={this.state.tweet.image} />
            </If>
            <div className="tweet-footer">
              <a className={this.state.tweet.liked ? 'like-icon liked' : 'like-icon'}
                onClick={this.handleLike.bind(this)}
                data-ignore-onclick>
                <i className="fa fa-heart " aria-hidden="true"
                  data-ignore-onclick></i> {this.state.tweet.likeCounter}
              </a>
              <If condition={!this.props.detail} >
                <a className="reply-icon" name="reply">
                  <i className="fa fa-reply" name="reply" aria-hidden="true" ></i> {this.state.tweet.replys}
                </a>
              </If>
            </div>
          </div>
        </article>
      )
    }
  }
  
  Tweet.propTypes = {
    tweet: propTypes.object.isRequired,
    detail: propTypes.bool
  }
  
  Tweet.defaultProps = {
    detail: false
  }
  export default Tweet;