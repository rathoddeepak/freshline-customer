import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text
} from 'react-native';
import Err from './err';
import Empty from './empty';
import Loading from './loading';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class Dazar extends Component {
	render() {		
		const {loading, error, length, emptyCustom, backgroundColor, lcont_size, lanim_size, emptyOther, onRetry, isFirst, custom} = this.props;
		if(!loading && error){
			return (
				<Err onPress={onRetry} />
			);
		}else if(loading && !error){
			return (
			  <Loading
			    container={lcont_size}
				animation={lanim_size}
				backgroundColor={backgroundColor}
			  />
			)
		}else if(!loading && !error && length === 0){			
			if(isFirst == true){
				return (
					<View style={{height:200,width:'100%',justifyContent:'center',alignItems:'center'}}>
					    <Text style={{textAlign:'center',fontWeight:'bold',fontSize:14,color:helper.silver}}>{custom}</Text>
				    </View>
			    )
			}else if(emptyOther != undefined){				
				return (
					<View style={{height:200,width:'100%',justifyContent:'center',alignItems:'center'}}>
						<Text style={{textAlign:'center',fontWeight:'bold',fontSize:14,width:'100%',color:helper.silver}}>{emptyCustom == undefined ? lang.z[cl].emdc : emptyCustom}</Text>
					</View>
				)
			}else{
				return (
					<Empty
					/>
				);
			}		
		}else{
			return (<View></View>)
		}	
	}
}