import React from 'react';
import {Route, Switch} from 'react-router-dom';
import routes from 'constants/routes';
import LoginPage from 'pages/authentication/LoginPage';
import SignUpPage from 'pages/onboarding/SignUpPage';
import AcceptTnC from 'pages/onboarding/AcceptTnC';
import QuestionsFlow from 'pages/onboarding/QuestionsFlow';
import LandingPage from 'pages/landing/LandingPage';
import ForgetPasswordPage from 'pages/authentication/ForgetPasswordPage';
import ResetPasswordPage from 'pages/authentication/ResetPasswordPage';
import NotFound from 'pages/errors/NotFoundPage';
import Dashboard from 'pages/dataLanding/dataLanding';
import Profile from 'pages/profile/Profile';
import HouseRecommendation from 'pages/housingRecommendation/HouseRecommendationPage';
import InsuranceRecommendation from 'pages/insuranceRecommendation/InsuranceRecommendationPage';
import Description from 'pages/recommendation/Description';



interface Props {
  isUserAuthenticated: boolean
}

/**
 * Stateless component responsible for rendering public or private routes.
 * If user is authenticated, render private routes, otherwise render public routes.
 * 
 * @author Lim Yan Kai
 * */
const Router = ({isUserAuthenticated}: Props) => {
  // render public routes
  if( !isUserAuthenticated ) {
    console.log("weiuhfwef")
    return (
      <Switch>
        <Route exact path={routes.HOME} component={LandingPage} />
        <Route exact path={routes.LOGIN} component={LoginPage} />
        <Route exact path={routes.SIGNUP} component={SignUpPage} />
        <Route exact path={routes.FORGET_PASSWORD} component={ForgetPasswordPage} />
        <Route exact path={routes.RESET_PASSWORD} component={ResetPasswordPage} />
        <Route exact path={routes.TOC} component={AcceptTnC} />
        <Route exact path={routes.ONBOARD} component={QuestionsFlow} />
        <Route component={NotFound} />
      </Switch>
    )
  } else {
    return (
      <Switch>
        <Route exact path={routes.HOME} component={LandingPage} />
        <Route exact path={routes.LOGIN} component={LoginPage} />
        <Route exact path={routes.PROFILE} component={Profile} />
        <Route exact path={routes.DATALANDING} component={Dashboard} />
        <Route exact path={routes.HOUSINGRECOMMENDATION} component={HouseRecommendation} />
        <Route exact path={routes.INSURANCERECOMMENDATION} component={InsuranceRecommendation} />
        <Route exact path={routes.DESCRIPTION} component={Description} />
        <Route exact path={routes.LOGOUT} />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default Router;