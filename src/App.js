import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('')

  const callManager = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  } 

  const onSubmit = async (event) => {
    event.preventDefault();
    
    setMessage('Waiting on transaction success...');

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    })

    setMessage('You have been entered!');
  }

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage('A winner has been picked!!');
  }

  useEffect(() => {
    callManager()
  })
  
  return (
    <div>
      <h2>Lottery contract</h2>
      <p>This contract is manager by {manager}</p>
      <p>There are currently {players.length} people entered, competing to </p>
      <p>win {web3.utils.fromWei(balance, 'ether')} ether</p>
      <hr/>

      <form onSubmit={onSubmit}>
        <h3>Want to try your luck?</h3>
        <div>
          <label>Amount of ether to enter </label>
          <input 
          value={value}
            onChange={event => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr/>
      <h3>Time to pick a winner</h3>
      <button onClick={onClick}>Pick a winner!</button>

      <hr/>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
