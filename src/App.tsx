import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  isStreaming: boolean,
  intervalId?: NodeJS.Timeout,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      isStreaming: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    return (<Graph data={this.state.data} />)
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      this.setState({ data: [...this.state.data, ...serverResponds] });
    });
  }

  /**
   * Start streaming data from the server
   */
  startDataStreaming() {
    this.setState({ isStreaming: true });
    const intervalId = setInterval(() => {
      this.getDataFromServer();
    }, 100);

    this.setState({ intervalId });
  }

  /**
   * Stop streaming data from the server
   */
  stopDataStreaming() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
    this.setState({ isStreaming: false, intervalId: undefined });
  }

  /**
   * Cleanup interval on component unmount
   */
  componentWillUnmount() {
    this.stopDataStreaming();
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => {
              if (this.state.isStreaming) {
                this.stopDataStreaming();
              } else {
                this.startDataStreaming();
              }
            }}>
            {this.state.isStreaming ? 'Stop Streaming Data' : 'Start Streaming Data'}
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
