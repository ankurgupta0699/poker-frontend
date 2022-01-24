import "reactjs-popup/dist/index.css";
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import AfterVerification from 'components/AfterVerification';
import CreateNewGroup from "components/Groups/CreateNewGroup";
import OwnedGroups from 'components/Groups/OwnedGroups';
import AllGroupInvites from "components/Invites/AllGroupInvites";
import PokerboardInvites from 'components/Invites/PokerboardInvites';
import ReceiveGroupInvites from "components/Invites/RecieveGroupInvites";
import SentGroupInvites from "components/Invites/SentGroupInvites";
import Navbar from 'components/Navbar/Navbar';
import PageNotFound from 'components/PageNotFound/PageNotFound';
import CreateGame from "components/Pokerboards/CreateGame";
import Dashboard from "components/Pokerboards/Dashboard";
import Pokerboards from "components/Pokerboards/Pokerboards";
import PokerboardUsers from "components/Pokerboards/PokerboardUsers";
import EditProfile from "components/Profile/EditProfile/EditProfile";
import ResetPassword from "components/Profile/EditProfile/ResetPassword";
import MyProfile from 'components/Profile/profileDetails/MyProfile';
import FetchJiraTickets from 'containers/FetchJiraTickets/FetchJiraTickets';
import FetchJiraToken from 'containers/FetchJiraToken/FetchJiraToken';
import Homepage from 'containers/Homepage/Homepage';
import ManageTickets from 'containers/ManageTickets/ManageTickets';
import Signin from 'containers/Signin/Signin';
import Signup from 'containers/Signup/Signup';
import VerifyEmail from 'containers/Signup/Verify'
import { urls } from 'constants/urls';
import WelcomePage from 'containers/WelcomePage/WelcomePage';


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />  
                <Switch>
                    <Route exact path={urls.VERIFYEMAIL} component={VerifyEmail}/>
                    <Route exact path={urls.CREATE_NEW_GROUP} component={CreateNewGroup}/>
                    <Route exact path={urls.OWNED_GROUPS} component={OwnedGroups}/>
                    <Route exact path={urls.AFTER_VERIFICATION} component={AfterVerification}/>
                    <Route exact path={urls.root} component={WelcomePage}/>
                    <Route exact path={urls.signin} component={Signin}/>
                    <Route exact path={urls.signup} component={Signup}/>
                    <Route exact path={urls.home} component={Homepage}/>
                    <Route exact path={urls.MY_PROFILE} component={MyProfile}/>
                    <Route exact path={urls.RESET_PASSWORD} component={ResetPassword}/>
                    <Route exact path={urls.EDIT_PROFILE} component={EditProfile}/>
                    <Route exact path={urls.SENT_GROUP_INVITES} component={SentGroupInvites}/>
                    <Route exact path={urls.ALL_GROUP_INVITES} component={AllGroupInvites}/>
                    <Route exact path={urls.RECEIVED_GROUP_INVITES} component={ReceiveGroupInvites}/>
                    <Route exact path={urls.CREATE_GAME} component={CreateGame}/>
                    <Route exact path={urls.POKERBOARDS} component={Pokerboards}/>
                    <Route exact path={urls.DASHBOARD} component={Dashboard}/>
                    <Route exact path={urls.POKERBOARD_MEMBERS} component={PokerboardUsers}/>
                    <Route exact path={urls.POKER_INVITES} component={PokerboardInvites} />
                    <Route exact path={urls.FETCH_JIRA_TOKEN} component={FetchJiraToken} />
                    <Route exact path={urls.FETCH_JIRA_TICKETS} component={FetchJiraTickets} />
                    <Route exact path={urls.MANAGE_TICKETS} component={ManageTickets} />
                    <Route component={PageNotFound}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
