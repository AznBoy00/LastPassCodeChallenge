import { connect } from 'react-redux';
import { authenticate } from '../contexts/app';
import React from 'react';
import { RootState } from '../reducers/rootReducer';

interface StateProps {
  username: any;
  password: any;
  authToken: string;
  privateInfo: string;
  errorMessage: string;
}

interface DispatchProps {
  authenticate: (username: string, password: string) => void;
}

const Authentication = (props: StateProps & DispatchProps): JSX.Element => {
  // state
  const [state, setState] = React.useState(props);
  let { username = '', password = '' } = state;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, username: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, password: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.authenticate(username, password);
  }

 return (
  <form className="login-form" onSubmit={(e) => { handleSubmit(e); }}>
     <span className="login-form__input-error">{props.errorMessage }</span>
    <div className="login-form__input-wrapper">
      <label className="login-form__input-label" htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={state.username} onChange={handleUsernameChange} autoComplete="username" />
    </div>
    <div className="login-form__input-wrapper">
      <label className="login-form__input-label" htmlFor="password">Password</label>
      <input type="password" id="password" name="password" value={state.password} onChange={handlePasswordChange} autoComplete="new-password" />
    </div>
    <div className="login-form__input-wrapper">
      <button type="submit">Login</button>
    </div>
  </form>
)};

const mapStateToProps = (state: RootState): StateProps => ({
  username: '',
  password: '',
  authToken: state.auth.authToken,
  privateInfo: state.auth.privateInfo,
  errorMessage: state.auth.errorMessage,
});

const mapDispatchToProps: DispatchProps = {
  authenticate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);