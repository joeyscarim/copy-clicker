import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';

import PrivateRoute from './components/common/PrivateRoute';

//layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// corporate pages
import Landing from './components/layout/Landing';
import TryIt from './components/corporate/TryIt';
import Faq from './components/corporate/Faq';
import Terms from './components/corporate/Terms';
import Privacy from './components/corporate/Privacy';

// auth pages
import Signup from './components/auth/Register';
import Login from './components/auth/Login';
import Forgot from './components/auth/Forgot';
import Reset from './components/auth/Reset';

// not found
import NotFound from './components/not-found/NotFound';

// private pages
import PostAdd from './components/post-add/PostAdd';
import Posts from './components/posts/Posts';
import PostsFeatured from './components/posts/PostsFeatured';
import PostsMy from './components/posts/PostsMy';

// old pages
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profile from './components/profile/Profile';

import Post from './components/post/Post';

import Profiles from './components/profiles/Profiles';

import { logoutUser } from './actions/authActions';

import './App.css';
import { clearCurrentProfile } from './actions/profileActions';

// TOOOOOOOOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// check for token
if (localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isauthenicated
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //logout the user
    store.dispatch(logoutUser());
    // clear the current profile
    store.dispatch(clearCurrentProfile());
    // redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    // toast('Wow so easy !');

    return (
      <Provider store={store}>
        <Router>
          <div className="App bg-light">
            <ToastContainer />
            <Navbar />
            <Switch>
              {/* corporate */}
              <Route exact path="/" component={Landing} />
              <Route exact path="/terms" component={Terms} />
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/try-it" component={TryIt} />
              <Route exact path="/faq" component={Faq} />

              {/* auth */}
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/forgot" component={Forgot} />
              <Route exact path="/reset" component={Reset} />

              {/* not auth */}
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:handle" component={Profile} />

              {/* private */}

              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute exact path="/add-post" component={PostAdd} />
              <PrivateRoute exact path="/community" component={Posts} />

              <PrivateRoute exact path="/my-copy" component={PostsMy} />

              <PrivateRoute exact path="/home" component={PostsFeatured} />

              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute exact path="/post/:id" component={Post} />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
              <Route exact path="/not-found" component={NotFound} />

              <Route component={NotFound} />
            </Switch>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
