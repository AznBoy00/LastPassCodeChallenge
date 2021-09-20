import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { authenticate } from '../contexts/authentication';
import logo from '../logo.svg';
import { useEffect } from 'react';

interface Props {
  username: string;
  authToken: string;
  privateInfo: string;
}

interface DispatchProps {
  authenticate: (username: string, password: string) => void;
}

const Authentication = (props: Props & DispatchProps): JSX.Element => {
  useEffect(() => {
    // authenticate('aaa', 'aaa');
    console.log('asd', props);
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(`something`)
    props.authenticate('aaa', 'aaa');
  }

 return (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
    </header>

     <form className="login-form" onSubmit={(e) => { handleSubmit(e); }}>
      <div className="login-form__input-wrapper">
        <label className="login-form__input-label" htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
      </div>
      <div className="login-form__input-wrapper">
        <label className="login-form__input-label" htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <div className="login-form__input-wrapper">
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
)};

const mapStateToProps = (state: RootState): Props => ({
  username: state.auth.username,
  authToken: state.auth.authToken,
  privateInfo: state.auth.privateInfo,
});

const mapDispatchToProps: DispatchProps = {
  authenticate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);