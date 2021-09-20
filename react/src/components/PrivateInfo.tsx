import { connect } from 'react-redux';
import { logout, savePrivateInfo } from '../contexts/app';
import React from 'react';
import { RootState } from '../reducers/rootReducer';

interface StateProps {
  username: string;
  password: string;
  privateInfo: string;
}

interface DispatchProps {
  savePrivateInfo: (username: string, password: string, privateInfo: string) => void;
  logout: () => void;
}

const PrivateInfo = (props: StateProps & DispatchProps): JSX.Element => {
  // state
  const [state, setState] = React.useState(props);
  let { privateInfo = '' } = state;
  
  const savePrivateInfoChange = (): void => {
    props.savePrivateInfo(props.username, props.password, privateInfo);
  };

  const handlePrivateInfoChange = (e: any): void => {
    setState({ ...state, privateInfo: e.target.value });
    // Auto Save
    savePrivateInfoChange();
  };


  const saveButtonClick = (): void => {
    savePrivateInfoChange();
    alert('Saved!');
  };

  const logout = (): void => {
    props.logout();
  };

  return (
    <div className="private-info__wrapper">
      <div className="private-info__button-wrapper">
        <label className="private-info__label" htmlFor="username">Hi { props.username }, here is your decoded private information</label>
      </div>
      <textarea id="privateInfo" className="private-info__textarea" name="privateInfo" value={state.privateInfo} onChange={handlePrivateInfoChange} />
      <div className="private-info__button-wrapper">
        <button type="button" onClick={saveButtonClick}>Save</button>
        <button type="button" onClick={logout}>Logout</button>
      </div>
    </div>
  )
};

const mapStateToProps = (state: RootState): StateProps => ({
  username: state.auth.username,
  password: state.auth.password,
  privateInfo: state.auth.privateInfo,
});

const mapDispatchToProps: DispatchProps = {
  savePrivateInfo,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateInfo);