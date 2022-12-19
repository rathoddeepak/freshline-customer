import React from 'react';
import {
  StyleSheet,
  TextInput,
  View, 
  Text
} from 'react-native';
import lang from 'assets/lang';
import helper from 'assets/helper';
import HeuButton from '../HeuButton/';
import Icon from '../icon';
export default class ExploreTopbar extends React.Component {
  render() {
    return (
        <View style={styles.searchC}>
          <View style={styles.searchB}>
             <View style={styles.textInput}>
               <View style={styles.icnH}>
                 <Icon name={lang.srch} color="#000" size={22} />
               </View>
                <View style={styles.txH}>
                  <TextInput
                    placeholderTextColor={'grey'}
                    style={styles.txI}                              
                    placeholder={'Search'} 
                    autoFocus                   
                    underlineColorAndroid={'transparent'}
                    selectionColor={helper.primaryColor+'3d'}                
                    {...this.props}
                  />
                </View>
             </View>
          </View>
          <View style={styles.searchF}>
            <HeuButton onPress={this.props.onPressF}>               
               <Icon name={lang.fltr} color={helper.primaryColor} size={30} />
            </HeuButton>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput:{    
    backgroundColor:'#f2f2f2',    
    borderRadius:10,
    height:'93%',
    justifyContent:'center',
    flexDirection:'row'
  },
  icnH:{
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    width:'10%'
  },
  txI:{color:'#000',height:'90%',padding:5,width:'100%'},
  txH:{
    height:'100%',
    justifyContent:'center',
    width:'90%'
  },
  searchC:{
    height:55,
    backgroundColor:'#000',
    flexDirection:'row',
    paddingTop:4
  },
  searchB:{
    height:'100%',
    width:'85%',
    padding:6    
  },
  searchF:{
    height:'100%',
    width:'15%',
    padding:10
  }
})

