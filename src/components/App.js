import React, { Component } from 'react'
import TransactionList from './TransactionList'
import TransactionListConfig from './TransactionListConfig'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { showAnnotated: true, showCredits: true };
    this.handleConfigChange = this.handleConfigChange.bind(this);
  }

  handleConfigChange(config) {
    this.setState(config);
  }

  render() {
    return (
      <div className='w-full h-full'>
        <TransactionListConfig config={this.state} onConfigChange={this.handleConfigChange}/>
        <TransactionList config={this.state} />
      </div>
    )
  }
}

export default App
