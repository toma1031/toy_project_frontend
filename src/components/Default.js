import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Top from './Top';
// import SignUp from './SignUp';
import Login from './Login';
// import MyPage from './MyPage';
// import PostDetail from './PostDetail';
// import Logout from './Logout';

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
                      {/* <Route exact path="/signup" component={SignUp} /> */}
                      <Route exact path="/login" component={Login} />
                      {/* <Route exact path="/logout" component={Logout} />
                      <Route exact path="/mypage" component={MyPage} />
                      <Route exact path="/post/:id" component={PostDetail} /> */}
                      <Route render={() => <p>not found!.</p>} />
                  </Switch>
              </div>
              <Footer />
            </div>
        );
    }
}

export default Default;
