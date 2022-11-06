import React from "react";
import TweetsContainer from "./TweetsContainer";
import SuggestedUsers from "./SuggestedUsers";
import propTypes from 'prop-types'
import { TwitterDashboard } from "./TwitterDashboard";

class Mytweets extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 no-padding-right">
                    <TweetsContainer profile={this.props.profile} onlyUserTweet={true} />
                </div>
                <div className="hidden-xs hidden-sm hidden-md col-lg-4" >
                    <SuggestedUsers />
                </div>
            </div>
        )
    }
}

Mytweets.propTypes = {
    profile: propTypes.object
}

export default Mytweets