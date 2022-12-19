import React, {useState, useEffect} from 'react'
import {Text, View, TouchableOpacity, Animated, Easing} from 'react-native'

export default class App extends React.Component{
  constructor(props) {
    super(props)
    this.playerYval = new Animated.Value(0)
    this.objXval = new Animated.Value(0)
    this.bgXval = new Animated.Value(0)
    this.state = {
        status: 'Start',
        objWidth: 40,
        trees: '🌲           🌴          🌳',
        score: 0,
        highScore: 0
    }
  }
  jump(){
    Animated.timing(this.playerYval, {
      toValue: -150,
      duration: 320,
      easing: Easing.linear,
      useNativeDriver: false
    }).start()
    setTimeout(() => {
      Animated.timing(this.playerYval, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false
      }).start()
    }, 200)
  }
  start(){
    setTimeout(() => {
      const objRun = Animated.loop(
        Animated.timing(this.objXval, {
          toValue: -450,
          duration: 1300,
          easing: Easing.linear,
          useNativeDriver: false,
          onComplete: (e) => {
            var objArray = [40, 50, 30, 20]
            var obj = objArray[Math.floor(Math.random() * objArray.length)]
            this.setState({objWidth: obj})
            this.secondRun()
            this.secondbgRun()
          } 
        }).start()
      )  
    }, 1000)
    this.checkStatus()
    this.countScore()
  }
  secondRun(){
    this.objXval.setValue(0)
    Animated.timing(this.objXval, {
      toValue: -450,
      duration: this.state.score > 100 ? 900 : 1300,
      easing: Easing.linear,
      useNativeDriver: false,
      onComplete: (e) => {
        var objArray = [40, 50, 60, 30, 20, 0]
        var obj = objArray[Math.floor(Math.random() * objArray.length)]
        this.setState({objWidth: obj})
        this.secondRun()
      } 
    }).start()
  }
  secondbgRun(){
    this.bgXval.setValue(0)
    Animated.timing(this.bgXval, {
      toValue: -500,
      duration: this.state.score > 100 ? 2400 : 3000,
      easing: Easing.linear,
      useNativeDriver: false,
      onComplete: (e) => {
        var objArray = ['🌲           🌴☁          🌳', '🌲     🌲🌲    ☁    🌳', '🌴', '🌳      🌳🌴  ☁    🌴', '🌹🌹', '☁ ☁']
        var obj = objArray[Math.floor(Math.random() * objArray.length)]
        this.setState({trees: obj})
        this.secondbgRun()
      } 
    }).start()
  }
  checkStatus(){
    this.objXval.addListener(({value}) => {
      if(this.state.objWidth > 0){
        if(this.playerYval._value > -40 && value >= -400 && value <= -330){
          //console.log('crash')
          this.setState({status: 'crashed'})
          if(this.state.score > this.state.highScore){
            this.setState({highScore: this.state.score})
          }
        }else{
         // console.log('no crash')
  
        }
      }
    })
  }
  countScore(){
    setInterval(() => {
      if(this.state.status == 'normal'){
        this.setState({score: this.state.score + 1})
      }
    }, 500);
  }
  render(){
    if(this.state.status == 'normal'){
	    return(
	      <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} onTouchStart={() => this.jump()}>
	        <Animated.View style={{height: 40, width: 40, backgroundColor: '#000', position: 'absolute', left: '10%',
	          transform: [{translateY: this.playerYval}], bottom: '40%'}} />
	        <Animated.View style={{height: 38, width: this.state.objWidth - 2, borderWidth: this.state.objWidth > 0 ? 2 : 0, borderColor: 'black',
	         backgroundColor: '#fff', position: 'absolute', left: '110%',
	          transform: [{translateX: this.objXval}], bottom: '40%'}} />  
	        <View style={{height: 2, width: '95%', backgroundColor: 'black', alignSelf: 'center', bottom: '40%', position: 'absolute'}} />
	        <Animated.Text style={{fontSize: 25, opacity: 0.4, zIndex: -10, left: '90%', position: 'absolute', bottom: '40%',
	         transform: [{translateX: this.bgXval}]}}>{this.state.trees}</Animated.Text>

	         <Text style={{position: 'absolute', top: 20, right: 30, fontSize: 18}}>Score: {this.state.score}</Text>
	      </View>
	    )
    }else if(this.state.status == 'crashed'){
      return(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 18}}>You made {this.state.score} Points</Text>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>HI: {this.state.highScore} Points</Text>
          <TouchableOpacity onPress={() => {
             setTimeout(() => {
              this.objXval.setValue(0)
              this.playerYval.setValue(0)
              this.setState({score: 0, status: 'normal'})
             }, 1000);
          }} style={{alignSelf: 'center', padding: 5, backgroundColor: 'black', marginTop: 20}}>
            <Text style={{color: 'white', fontSize: 15, }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => {
             setTimeout(() => {
               this.objXval.setValue(0)
               this.playerYval.setValue(0)
               this.setState({score: 0, status: 'normal'})
               this.start()
             }, 1000);
          }} style={{alignSelf: 'center', padding: 5, backgroundColor: 'black', marginTop: 10}}>
            <Text  style={{color: 'white', fontSize: 15, }}>START</Text>
          </TouchableOpacity>
        </View>
      ) 
    }
  }
}