import React from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Router from 'components/router/Router';
import Header from 'components/navigation/Header';
import Footer from 'components/navigation/Footer';
import AuthContext, { authContextDefaultValue, AuthContextState } from 'contexts/AuthContext';
import RecommendationContext, { recommendationContextDefaultValue, RecommendationContextState } from 'contexts/RecommendationContext';
import HeaderNotLoggedIn from 'components/navigation/Header_notLoggedIn';
import cognitoService from 'utils/CognitoService';
import background from './background.jpg';
import { useHistory } from 'react-router-dom';
import routes from 'constants/routes';
import { Helmet } from 'react-helmet';



const InterFont = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      'sans-serif',
    ].join(','),
 },});

/**
 * Base Component
 * Integrates the functionality for routing 
 * and React contexts for authentication.
 * @returns {JSX.Element}
 * 
 * @author Lim Yan Kai, Lim Her Huey, Sokunthea
 */
function App() {

  const [authState, setAuthState] = React.useState<AuthContextState>({
    ...authContextDefaultValue.authState
  });

  const [recommendationState, setRecommendationState] = React.useState<RecommendationContextState>({
    ...recommendationContextDefaultValue.recommendationState
  });

  const history = useHistory();

  React.useEffect(() => {
    const accessToken = cognitoService.getAccessToken()
    if(accessToken) {
      const email = cognitoService.getEmail()
      setAuthState({
        isAuthenticated: true,
        email: email
      })
      if (history.location.pathname === routes.LOGIN || 
        history.location.pathname === routes.ONBOARD ||
        history.location.pathname === routes.SIGNUP ||
        history.location.pathname === routes.FORGET_PASSWORD) {
          history.push(routes.DATALANDING)
      }
    }
  }, [history])
  
  return (
    <ThemeProvider theme={InterFont}>
      <Helmet>
        <title> Pathfinder </title>
      </Helmet>
      <div className="App" style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'auto 100%',
        width: '100vw',
        minHeight: '100vh',
        overflow: 'scroll'
      }}>
        <AuthContext.Provider value={{authState, setAuthState}}>  
        <RecommendationContext.Provider value={{recommendationState, setRecommendationState}}>  
          <div className="test">
            {authState.isAuthenticated ? <Header />: <HeaderNotLoggedIn />}
            <Router isUserAuthenticated={authState.isAuthenticated}/>
          </div>
        </RecommendationContext.Provider>
        </AuthContext.Provider>
      </div>
      <Footer/>
    </ThemeProvider>

  );
}

export default App;
