import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Modal,
	Image,
	Text,
	ScrollView
} from 'react-native';
import {
	Icon,
	HeuButton
} from 'components';
import Share from './index';
import helper from 'assets/helper';
import BottomSheet from 'reanimated-bottom-sheet';
export default class ShareSheet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apps:[],
			v:false,
			notSet:true
		}
	}
	init = async (content) => {
		let packages = [];		
		let final = [];		
		let apps = await Share.getAppList(content);				
		apps.forEach(app => {
			if(packages.indexOf(app.package) == -1){
				final.push(app);								
				packages.push(app.package);
			}			
		});
		this.setState({apps,notSet:false});
	}
	open = (content) => {
		if(this.state.notSet){
			this.init(content);      
		}
		this.setState({v:true}, () => {
			this.sheet.snapTo(1)
		});
	}
	close = () => {
		this.sheet.snapTo(0)
		setTimeout(() => {
			this.setState({v:false});
		}, 200);
	}
	shareTo = (i) => {
		Share.shareTo(i);
		this.close();
    }
	render() {
		const {
			v,
			apps
		} = this.state;
		return (
			<Modal visible={v} transparent onRequestClose={this.close} animationType="fade">
			 <View style={helper.model2}>
		       <BottomSheet
		         ref={ref => this.sheet = ref}
		         snapPoints={[0, 450]}
		         renderContent={this.renderContent}         
		         borderRadius={10}
		       />
		     </View>
		   </Modal>
		)
	}
	renderContent = () => {	    
	    return (      
	      <ScrollView><View
	          style={{
	            backgroundColor: helper.grey4,                   
	            flexDirection:'row',
	            flexWrap: 'wrap',	            
	            padding: 16
	          }}
	        >
	        
	          {this.state.apps.map((app, i) =>
	          	<View style={{width:'33%',alignItems:'center'}} key={i}>
		            <HeuButton onPress={() => this.shareTo(i)} key={i} style={{width:90,height:90,justifyContent:'center',alignItems:'center',marginHorizontal:5}}>
			          <Image style={{width:50,height:50,padding:5,marginBottom:6}} source={{uri:'data:image/png;base64,'+app.icon}} />
			          <Text numberOfLines={1} style={{fontSize:10,color:'white'}}>{app.name}</Text>
			        </HeuButton>
		        </View>
		      )}
		    
	        </View></ScrollView>

	    )
	  }
}