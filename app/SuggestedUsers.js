import React, {useState, useEffect} from "react";
import APIInvoker from "./utils/APIInvoker";
import { Link } from "react-router-dom";

const SuggestedUsers = (props) => {
    
    const [state, setState] = useState(null)

    useEffect( () => {
        APIInvoker.invokeGET(`/secure/suggestedUsers`, response => {
            setState(response.body)
        }, error => {
            setState([])
            console.log('Error =>', error)
        })
    },[])

    
    return(
        <aside id="suggestedUsers" className="twitter-panel" >
            <span className="su-title">Who to follow?</span>
            <If condition={state != null} >
                <For each='user' of={state} >
                    <div className="sg-item" key={user._id} >
                        <div className="su-avatar" >
                            <img src={user.avatar} alt={'sg-user'} />
                        </div>
                        <div className="sg-body" >
                            <div>
                                <Link to={'/' + user.userName} >
                                    <span className="sg-name">{user.name}</span>
                                    <span className="sg-username">@{user.userName}</span>
                                </Link>
                            </div>
                            <Link to={'/' + user.userName} className='btn btn-primary btn-sm' >
                                <i className="fa fa-user-plus" aria-hidden='true'></i>
                                Ver perfil
                            </Link>
                        </div>
                    </div>
                </For>
            </If>
        </aside>
    )
}

export default SuggestedUsers