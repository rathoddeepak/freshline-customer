import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AppState} from 'react-native';
import QRscanner from 'components/qrscanner';
import {
  Icon,
  HeuButton
} from 'components';
import lang from 'assets/lang';
import helper from 'assets/helper';
export default class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashMode: false,
      zoom: 0,
      codeRead:false
    };
    this.focus = null;
    this.blur = null;
  }
  
  componentDidMount() {    
    AppState.addEventListener('change', this.appState);  
    setTimeout(() => {
      this.attach();
    }, 400);    
    this.blur = this.props.navigation.addListener('blur', () => {
      this.scanner.stop();
    });    
  }
  attach = () => {
    this.focus = this.props.navigation.addListener('focus', () => {
      this.setState({codeRead:false})
      this.scanner.start();
    });
  }
  componentWillUnmount() {
    if(this.blur != null)this.blur();
    if(this.focus != null)this.focus();
    AppState.removeEventListener("change", this.appState);
  }

  appState = (state) => {    
    if(state == 'active'){
      this.scanner?.start();
    }else{
      this.scanner?.stop();
    }
  }

  render() {
    const {
      flashMode,
      zoom
    } = this.state;
    return (
      <View style={s.container}>
        <QRscanner
         onRead={this.onRead}
         isRepeatScan
         rectHeight={250}
         rectWidth={250}
         ref={ref => this.scanner = ref}
         renderBottomView={this.bottomView}
         flashMode={flashMode}
         zoom={zoom}     
         finderY={50}
        />
      </View>
    );
  }
  bottomView = ()=>{
    const {
      flashMode,
      codeRead
    } = this.state;
    return(
    <View style={{flex:1,justifyContent:'space-around',alignItems:'center',backgroundColor:'#0000004D',flexDirection:'row'}}>
      <HeuButton onPress={()=>this.setState({flashMode:!this.state.flashMode})} style={s.fl}>
       <Icon name={flashMode ? lang.fon : lang.fof} color={helper.white} size={30} />
      </HeuButton>

      {codeRead ? <HeuButton onPress={() => this.r(false)} style={s.fl}>
       <Icon name={lang.rty} color={helper.white} size={30} />
      </HeuButton> : null}

    </View>
    );
  }
  onRead = (data) => {  
    data = data.split('/');    
    if(data.length > 3){
      let task = data[3];
      let task_id = data[4];      
      if(!isNaN(task_id)  && task_id != ''){
        if(task == 'menu'){
          this.props.navigation.navigate('OrderInHotel', {id:task_id});
        }else{          
          this.r(true);
        }
      }else{        
        this.r(true);
      }
    }else{      
      this.r(true);
    }
  }

  r = (codeRead = false) => {
    if(!codeRead)this.scanner.reset();
    this.setState({codeRead});
  }

}
const s = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#000'},
  fl:{width:50,height:50,borderRadius:100,justifyContent:'center',alignItems:'center',backgroundColor:'#00000052'}
});