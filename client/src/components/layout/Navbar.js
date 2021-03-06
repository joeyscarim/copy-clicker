import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const leftAuthLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link btn-signup" to="/home">
            {' '}
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link btn-login" to="/community">
            {' '}
            Community
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link className="nav-link btn-login" to="/community">
            {' '}
            Community
          </Link>
        </li> */}
        <li className="nav-item">
          <Link className="nav-link btn-login" to="/my-copy">
            {' '}
            My Copy
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link className="nav-link btn-login" to="/profile">
            {' '}
            Account
          </Link>
        </li> */}
      </ul>
    );

    const leftGuestLinks = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link btn-signup" to="/try-it">
            {' '}
            Try It
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link btn-login" to="/faq">
            {' '}
            FAQ
          </Link>
        </li>
      </ul>
    );

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        {/* <li className="nav-item">
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: '25px',
              marginRight: '15px',
              verticalAlign: '-17px'
            }}
            title="You must have a gravatar connected to your email to display an image"
          />
        </li> */}
        {/* <li className="nav-item">
          <a
            href=""
            className="nav-link btn-signup"
            onClick={this.onLogoutClick.bind(this)}
          >
            Profile
          </a>
        </li> */}

        <li className="nav-item">
          <Link className="nav-link btn-login" to="/profile">
            {' '}
            {user.name}
          </Link>
        </li>

        <li className="nav-item">
          <a
            href=""
            className="nav-link btn-login"
            onClick={this.onLogoutClick.bind(this)}
          >
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link btn-signup" to="/signup">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link btn-login" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-black">
        <div className="container">
          <Link className="navbar-brand logo-text" to="/">
            <i className="fas fa-quote-left logo" />
            CopyClicker
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            {isAuthenticated ? leftAuthLinks : leftGuestLinks}

            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(
  Navbar
);
