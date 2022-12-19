import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text,View, Modal,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import {View as AniView} from 'react-native-animatable';
import helper from 'assets/helper';
export default class Dailog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      act1:'',      
      act2:'',
      desc:'',
      title:'',
      visible:false      
    }
    this.actionNegative = null;
    this.actionPositive = null;
  }  
  show = ({title, act1, act2, desc}, positive, negative) => {    
    this.actionPositive = positive;
    this.actionNegative = negative;
    this.setState({title, act1, act2, desc}, () => {
      this.setState({
        visible:true
      })
    })
  }
  hAct1 = () => {   
   this.closeModal();
  }
  hAct2 = () => {
   if(this.actionPositive != null)
    this.actionPositive();
   this.actionNegative = null;
   this.closeModal();
  }
  closeModal = () => {    
    if(this.actionNegative != null)
      this.actionNegative();
    this.actionPositive = null;
    this.actionNegative = null;
    this.setState({ visible: false });
  }
  render() {
    const {
      act1,
      act2,
      desc,
      title,
      visible,      
    } = this.state;
    return (
      <Modal visible={visible} transparent onRequestClose={this.closeModal} animationType="fade">
       <View style={{height:'100%',width:'100%',backgroundColor:'#00000099',justifyContent:'center',alignItems:'center'}}>
        <AniView animation="fadeInDown" ref={ref => this.zoom = ref} style={{width:300,backgroundColor:helper.grey4,elevation:10,borderRadius:10}}>
         <Text style={{fontSize:16,fontWeight:'bold',color:helper.primaryColor,margin:10,width:'80%'}} numeberOfLines={1}>{title}</Text>
         <View style={{minHeight:80,justifyContent:'center'}}><Text style={{fontSize:16,color:helper.silver,margin:10}} numeberOfLines={4}>{desc}</Text></View>
         <View style={{flexDirection:'row',width:'100%',justifyContent:'flex-end',height:50,alignItems:'center'}}>
          <TouchableOpacity onPress={this.hAct1}>
           <Text style={{fontSize:14,fontWeight:'bold',color:helper.silver,margin:6,width:50,textAlign:'center'}}>{act1}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.hAct2}>
           <Text style={{fontSize:14,fontWeight:'bold',color:helper.silver,margin:6,width:50,textAlign:'center'}}>{act2}</Text>
          </TouchableOpacity>
         </View>
        </AniView>
       </View>
      </Modal>
    )
  }
}