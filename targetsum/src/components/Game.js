import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';

class Game extends React.Component{
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
  };
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };
  gameStatus = 'PLAYING';
  randomNumbers = Array
    .from({ length: this.props.randomNumberCount })
    .map(() => 1 + Math.floor(22 * Math.random())
  );
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

    componentDidMount() {
      this.intervalId = setInterval(() => {
        this.setState((prevState) => {
          return {remainingSeconds: prevState.remainingSeconds -1};
        }, () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        });
      }, 1000);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId);
    }

  isNumberSelected = (numberIndex) => {
      return this.state.selectedIds.indexOf(numberIndex) >= 0;
  }
  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };
  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0); {
      this.gameStatus = this.calcgameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.interval)
      }
    }
  }
  calcgameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.randomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };



  render() {
    const gameStatus = this.gameStatus;
    return(
      <View style = {styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
        {this.target}</Text>
        <View style={styles.randomContainer}>
          {this.randomNumbers.map((randomNumber, index) => (
            <RandomNumber
            key={index}
            id={index}
            number={randomNumber}
            isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'
          }
            onPress={this.selectNumber}
            />
          ))}
        </View>
        <Text style={styles.timer} >{this.state.remainingSeconds}</Text>
        <Text style={styles.statusgame} >{gameStatus}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fddf00',
    flex: 1,
    paddingTop: 30,
  },

  target: {
    fontSize: 65,
    backgroundColor: 'gray',
    marginHorizontal: 50,
    textAlign: 'center',
  },

  randomContainer: {
    flex: 1,
    paddingTop: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },

  random: {
    backgroundColor: '#999',
    width: 150,
    marginHorizontal: 15,
    marginVertical: 50,
    fontSize: 50,
    textAlign: 'center',
  },

  statusgame: {
    textAlign: 'right',
    fontSize: 30,
    paddingRight: 20,
  },

  timer: {
    fontSize: 30,
    textAlign: 'left',
    paddingLeft: 20,
  },

  STATUS_PLAYING: {
    backgroundColor: '#bbb'
  },
  STATUS_WON: {
    backgroundColor: 'green'
  },
  STATUS_LOST: {
    backgroundColor: 'red'
  },
});



export default Game;
