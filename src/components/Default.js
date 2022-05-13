import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Top from './Top';
import Signup from './Signup';
import Login from './Login';
import MyPage from './MyPage';
import MyPagePasswordUpdate from './MyPagePasswordUpdate';
import CancelMembership from './CancelMembership';
import Logout from './Logout';
import Post from './Post';
import PostDetail from './PostDetail';
import MessageRoom from './MessageRoom';
import MessageRoomForOwner from './MessageRoomForOwner';
import MessageRoomList from './MessageRoomList';
import About from './About';

//APIURL
export const apiURL = 'http://localhost:8000/';

class Default extends React.Component {
    render() {
        return (
            <div>
              <Header />
              <div className="main">
                  <Switch>
                      <Route exact path="/" component={Top} />
                      <Route exact path="/signup" component={Signup} />
                      <Route exact path="/login" component={Login} />
                      <Route exact path="/logout" component={Logout} />
                      <Route exact path="/mypage" component={MyPage} />
                      <Route exact path="/mypage_password_update" component={MyPagePasswordUpdate} />
                      <Route exact path="/cancel_membership" component={CancelMembership} />
                      <Route exact path="/post" component={Post} />
                      <Route exact path="/post/:id" component={PostDetail} />
                      <Route exact path="/post/:id/open_messageroom" component={MessageRoom} />
                      <Route exact path="/messagerooms/:id" component={MessageRoomForOwner} />
                      <Route exact path="/messagerooms/" component={MessageRoomList} />
                      <Route exact path="/about/" component={About} />
                      {/* URLが見つからなかったら下記を返す */}
                      <Route render={() => <p>not found!.</p>} />
                  </Switch>
              </div>
              <Footer />
            </div>
        );
    }
}
export default Default;
