import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3utils/web3';
import SimpleCounter from './web3utils/simple-counter.js';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contract: {},
      balance: 0,
      updateValue: '123',
      alertMessage: web3 ? 'Ready' : 'Invalid web3',
      isConnected: false
    }
    console.log('App.js', web3);
  }

  async componentWillMount() {
    const balance = await SimpleCounter.methods.getBalance().call();
    console.log('componentWillMount', balance, SimpleCounter);
    this.setState({ balance, updateValue: parseInt(balance) + 1, contract: SimpleCounter });
  }

  postUpdateValue = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log('target accounts', accounts, web3);

    this.setState({ alertMessage: 'Processing update ...' });
    const response = await SimpleCounter.methods.update(this.state.updateValue).send({
      from: accounts[0]
    });
    console.log('Done', response);

    this.setState({ alertMessage: `Updated ! Gas cost was:${response.gasUsed}` });

    await this.getLatestValue(event)
  }

  getLatestValue = async (event) => {
    this.setState({ alertMessage: 'Trying to read the latest counter value ...' });
    const balance = await SimpleCounter.methods.getBalance().call();
    console.log('latest balance is', balance);
    this.setState({ balance, updateValue: balance, alertMessage: 'Received latest balance. Ready' });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Simple counter has {this.state.balance} at {this.state.contract._address}
          </p>

          <form>
            <input value={this.state.updateValue} onChange={event => this.setState({ updateValue: event.target.value })} />
            <button onClick={this.postUpdateValue}>Update value</button>
          </form>

          <p>{this.state.alertMessage}</p>
          <button onClick={this.getLatestValue}>Get latest value</button>
        </div>
      </div>
    );
  }
}

export default App;
