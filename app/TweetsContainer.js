import React, {useEffect} from "react";
import APIInvoker from "./utils/APIInvoker";
import propTypes from "prop-types";
import Tweet from "./Tweet";
import InfiniteScroll from "react-infinite-scroller";
import Reply from "./Reply";
import update from 'immutability-helper'
import { useDispatch, useSelector } from "react-redux";
import { getTweet, addTweet } from "./redux/actions/tweetsActions";
const TweetsContainer = (props) => {
    
    const dispatch = useDispatch()

    const tweets = useSelector(state => state.tweets.tweets)
    const hasMore = useSelector(state => state.tweets.hasMore)

    useEffect(()=>{
        const username = props.profile.userName
        const onlyUserTweet = props.onlyUserTweet

        dispatch(getTweet(username, onlyUserTweet, 0))
    }, [props.profile.username, props.onlyUserTweet])

    const addNewTweet = (newTweet) => {
        dispatch(addTweet(newTweet))
    }

    const loadMore = (page) => {
        const username = props.profile.userName
        const onlyUserTweet = props.onlyUserTweet
        dispatch(getTweet(username, onlyUserTweet, page - 1))
    }


    return (
        <main className="twitter-panel">
            <Choose>
                <When condition={props.onlyUserTweet}>
                    <div className="tweet-container-header">
                        TweetsDD
                    </div>
                </When>
                <Otherwise>
                    <Reply profile={props.profile} operations={{ addNewTweet }} />
                </Otherwise>
            </Choose>
            <InfiniteScroll
                pageStart={1}
                loadMore={loadMore}
                hasMore={hasMore}
                loader={<div className="loader" key={0}>Loading ...</div>} >

                <For each='tweet' of={tweets}>
                    <Tweet key={tweet._id + Math.random()} tweet={tweet} />
                </For>

            </InfiniteScroll>
            <If condition={!hasMore} >
                <p className="no-tweets">No tweets to show</p>
            </If>
        </main>
    )
    
}

TweetsContainer.propTypes = {
    onlyUserTweet: propTypes.bool,
    profile: propTypes.object
}

TweetsContainer.defaultProps = {
    onlyUserTweet: false,
    profile: {
        username: ""
    }
}

export default TweetsContainer