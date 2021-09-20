import { connect } from 'react-redux';
import { logout, savePrivateInfo } from '../contexts/app';
import React from 'react';
import { RootState } from '../reducers/rootReducer';

interface StateProps {
  username: string;
  authToken: string;
  privateInfo: string;
}

interface DispatchProps {
  savePrivateInfo: (authToken: string, privateInfo: string) => void;
  logout: () => void;
}

const PrivateInfo = (props: StateProps & DispatchProps): JSX.Element => {
  // state
  const [state, setState] = React.useState(props);
  let { privateInfo = '' } = state;

  const handlePrivateInfoChange = (e: any): void => {
    setState({ ...state, privateInfo: e.target.value });
  };

  const savePrivateInfoChange = (): void => {
    props.savePrivateInfo(props.authToken, privateInfo);
  };

  const logout = (): void => {
    props.logout();
  };

  return (
    <div className="private-info__wrapper">
      <div className="private-info__button-wrapper">
        <label className="private-info__label" htmlFor="username">Private Information</label>
      </div>
      <textarea id="privateInfo" className="private-info__textarea" name="privateInfo" value={state.privateInfo} onChange={handlePrivateInfoChange} />
      <div className="private-info__button-wrapper">
        <button type="button" onClick={savePrivateInfoChange}>Save</button>
        <button type="button" onClick={logout}>Logout</button>
      </div>
    </div>
  )
};

const mapStateToProps = (state: RootState): StateProps => ({
  username: state.auth.username,
  authToken: state.auth.authToken,
  privateInfo: state.auth.privateInfo,
});

const mapDispatchToProps: DispatchProps = {
  savePrivateInfo,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateInfo);