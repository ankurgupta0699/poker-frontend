import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

import './WelcomePage.css';
import { arrivalAtWelcomePageAC } from 'actions/navbar';
import { urls } from 'constants/urls';


const WelcomePage = (props) => {
    const { navbarUpdateLogin } = props;
    const history = useHistory();
    const id = localStorage.getItem('id');

    useEffect(() => {
        navbarUpdateLogin();
        if(id){
            history.push(urls.home);
        }
    }, []);
    return (
        <div className='welcome-page'>
            <div className='text'>Wanna play a game?</div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        atWelcome: state.navbar.atWelcome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navbarUpdateLogin: () => dispatch(arrivalAtWelcomePageAC()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
