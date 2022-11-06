import React, {useState, useEffect, useContext} from "react";
import update from "immutability-helper";
import APIInvoker from "./utils/APIInvoker";
import { NavLink, Outlet} from "react-router-dom";
import Mytweets from "./MyTweets";
import Followings from "./Followings";
import UserContext from "./context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { loadProfile, toggleEditMode, follow, handleInput, save, rest } from './redux/actions/userPageActions'
import { resetTweets } from './redux/actions/tweetsActions'

const UserPage = (props) => {
  
  const userContext = useContext(UserContext)

  const dispath = useDispatch()
  const profile = useSelector(state => state.userPage.profile )
  const edit = useSelector(state => state.userPage.edit )

  useEffect(() => {
    dispath(resetTweets())
    dispath(rest())
    dispath(loadProfile(props.match.params.user))

    return () => {
      dispath(rest())
    }
  }, [props.match.params.user])

  const handleImageChange = (e) => {
    e.preventDefault();
    e.persist()

    let file = e.target.files[0];
    if (file.size > 1240000) {
      alert("Image above 1MB");
      return;
    }

    let reader = new FileReader();
    reader.onloadend = () => {
      dispath(handleInput(e.target.id, reader.result))
    };

    reader.readAsDataURL(file);
  }

  const handleInputChange = (e) => {
    let id = e.target.id;
    let value = e.target.value
    dispath(handleInput(id,value))
  }

  const render = () => {
    if(profile === null) return null

    return (
      <div id="user-page" className="app-container animated fadeIn">
        <header className="user-header">
          <div className="user-banner" style={{ backgroundImage: 'url(' + (profile.banner) + ')' }}>
            <If condition={edit}>
              <div>
                <label htmlFor="banner" className="btn select-banner">
                  <i className="fa fa-camera fa-2x" aria-hidden="true"></i>
                  <p>Edit banner picture</p>
                </label>
                <input
                  href="#"
                  className="btn"
                  accept=".gif, .jpg, .jpeg, .png"
                  type="file"
                  id="banner"
                  onChange={handleImageChange}
                />
              </div>
            </If>
          </div>
          <div className="user-summary">
            <div className="container-fluid">
              <div className="row">
                <div className="hidden-xs col-sm-4 col-md-push-1 col-md-3 col-lg-push-1 col-lg-3"></div>
                <div className="col-xs-12 col-sm-8 col-md-push-1 col-md-7 col-lg-push-1 col-lg-7">
                  <ul className="user-summary-menu">
                    <li>
                      <NavLink
                        to={`/${profile.userName}`}
                        className={({ isActive }) =>
                          isActive ? "selected" : ""
                        }
                      >
                        <p className="summary-label">TWEETS</p>
                        <p className="summary-value">{profile.tweetCount}</p>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/${profile.userName}/following`}
                        className={({ isActive }) =>
                          isActive ? "selected" : ""
                        }
                      >
                        <p className="summary-label">FOLLOWING</p>
                        <p className="summary-value">{profile.following}</p>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/${profile.userName}/followers`}
                        className={({ isActive }) =>
                          isActive ? "selected" : ""
                        }
                      >
                        <p className="summary-label">FOLLOWERS</p>
                        <p className="summary-value">{profile.followers}</p>
                      </NavLink>
                    </li>
                  </ul>

                  <If condition={profile.userName === userContext.userName}>
                    <button
                      className="btn btn-primary edit-button"
                      onClick={() => dispath(edit ? save() : toggleEditMode())} >
                      {edit ? "Save" : "Edit"}
                    </button>
                  </If>

                  <If
                    condition={
                      profile.follow != null &&
                      profile.userName !== userContext.userName
                    }
                  >
                    <button
                      className="btn edit-button"
                      onClick={() => dispath(follow())} >
                      {profile.follow ? (
                        <span>
                          <i
                            className="fa fa-user-times"
                            aria-hidden="true"
                          ></i>
                          Following
                        </span>
                      ) : (
                        <span>
                          <i className="fa fa-user-plus" aria-hidden="true"></i>
                          Follow
                        </span>
                      )}
                    </button>
                  </If>

                  <If condition={edit}>
                    <button
                      className="btn edit-button"
                      onClick={() => dispath(toggleEditMode())} >
                      Cancel
                    </button>
                  </If>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container-fluid">
          <div className="row">
            <div className="hidden-xs col-sm-4 col-md-push-1 col-md-3 col-lg-push-1 col-lg-3">
              <aside id="user-info">
                <div className="user-avatar">
                  <Choose>
                    <When condition={edit}>
                      <div className="avatar-box">
                        <img src={profile.avatar} />
                        <label
                          
                          htmlFor="avatar"
                          className="btn select-avatar"
                        >
                          <i
                            className="fa fa-camera fa-2x"
                            aria-hidden="true"
                          ></i>
                          <p>Photo</p>
                        </label>
                        <input
                          href="#"
                          id="avatar"
                          className="btn"
                          type="file"
                          accept=".gif, .jpg, .jpeg, .png"
                          onChange={handleImageChange}
                        />
                      </div>
                    </When>
                    <Otherwise>
                      <div className="avatar-box">
                        <img src={profile.avatar} />
                      </div>
                    </Otherwise>
                  </Choose>
                </div>
                <Choose>
                  <When condition={edit}>
                    <div className="user-info-edit">
                      <input
                        maxLength="20"
                        type="text"
                        value={profile.name}
                        onChange={handleInputChange}
                        id="name"
                      />
                      <p className="user-info-username">@{profile.userName}</p>
                      <textarea
                        maxLength="180"
                        id="description"
                        value={profile.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </When>
                  <Otherwise>
                    <div>
                      <p className="user-info-name">{profile.name}</p>
                      <p className="user-info-username">@{profile.userName}</p>
                      <p className="user-info-description">
                        {profile.description}
                      </p>
                    </div>
                  </Otherwise>
                </Choose>
              </aside>
            </div>
            <div className="col-xs-12 col-sm-8 col-md-7 col-md-push-1 col-lg-7">
              <If condition={profile.userName}>
                <Outlet context={{profile}} />
              </If>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return render()
}

export default UserPage;
