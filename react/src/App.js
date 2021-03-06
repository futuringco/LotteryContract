import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    address: '',
    balance: '',
    value: '0.1',
    message: '',
    amount: '0',
    account: '',
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const address = lottery.options.address;
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const [account] = await web3.eth.getAccounts();
    this.setState({ manager, players, address, balance, account });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.balance !== this.state.balance) {
      const amount = web3.utils.fromWei(this.state.balance, 'ether');

      this.setState({
        amount,
      });
    }
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ message: 'Waiting for Ethereum Network' });

    if (this.state.account !== '') {
      await lottery.methods.enter().send({
        from: this.state.account,
        value: web3.utils.toWei(this.state.value, 'ether'),
      });

      this.setState({
        message: "You've been entered with " + this.state.value + ' ETH!',
      });

      const balance = await web3.eth.getBalance(lottery.options.address);
      this.setState({ balance });
    } else {
      this.setState({ message: 'Ops, no account' });
    }
  };

  onClickWinner = async () => {
    this.setState({ message: 'Waiting for Ethereum Network' });

    await lottery.methods.pickWinner().send({
      from: this.state.account,
    });
    this.setState({ message: 'A winner has been picked!' });
				const balance = await web3.eth.getBalance(lottery.options.address);
				const players = await lottery.methods.getPlayers().call();
				this.setState({ balance, players });
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    /*web3.eth.getAccounts()
            .then(console.log);*/ // visualizza gli account della versione di web3 di Metamask

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to HACK Lottery</h1>
          <div>
            {this.state.account !== '' &&
              this.state.account === this.state.manager && (
                <button onClick={this.onClickWinner}>Pick a winner!</button>
              )}
          </div>
        </header>
        {this.state.address ? (
          <p className="App-intro">
            <br /> deployed by {this.state.manager}
            <br /> at {' '}
            <a
              href={`https://rinkeby.etherscan.io/address/${
                this.state.address
              }`}
              target="_blank"
            >
              {this.state.address}
            </a>
            <br /> and has {this.state.amount} ETH from{' '}
            {this.state.players.length} player/s
          </p>
        ) : (
          <p>Devi autenticarti su Metamask</p>
        )}

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Enter Lottery</h4>
          <div>
            <label>Amount of ether to enter, min is 0.01 ETH</label>
            <br />
            <input
              min="0.01"
              step="0.01"
              type="number"
              value={this.state.value}
              onChange={this.handleChange}
            />
            ETH<br />
            <button>Enter</button>
            <br />
            <br />
            <hr />
            {this.state.message}
          </div>
        </form>
      </div>
    );
  }
}

export default App;
