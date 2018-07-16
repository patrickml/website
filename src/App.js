import React, { Component } from 'react';
import { CapsuleProvider } from '@iosio/capsule';
import Background from 'Components/Background';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Background />
      </div>
    );
  }
}

export default CapsuleProvider({
})(App);
