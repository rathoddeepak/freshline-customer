import React, { Component } from 'react';
import {	
	Text,
	View	
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet'
import helper from 'assets/helper';
import {ScrollView} from 'react-native-gesture-handler'
const snapTo = helper.height * 80 / 100;
export default class ReadMore extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isMore: false,
			gesture:false
		}
	}
	renderContent = () => {
		return (
			<View
		      style={{
		        backgroundColor: '#000000',		        
		        alignItems: 'center',
		        height:200,
		        padding:10
		      }}>
		      <ScrollView>
		       <Text style={{fontSize:13,color: 'white'}}>{this.props.text}</Text>
		       </ScrollView>
		    </View>
		)
	}
	onTextLayout = ({nativeEvent}) => {		
		const len = nativeEvent.lines.length;
		this.setState({
			isMore:len > this.props.numLines,
		})
	}
	handlePress = () => {
		if(this.state.isMore)this.sheet.snapTo(0);
		this.setState({

		})
	}
	render() {
		const {
			text, 
			style,
			numLines
		} = this.props;
		const {isMore,gesture} = this.state;		
		return (
			<>
			  <Text numberOfLines={numLines} style={style} onTextLayout={this.onTextLayout}>{text}</Text>			  
			  {isMore ? <Text style={[style, {color:helper.primaryColor,fontSize:11}]} onPress={this.handlePress}>Read More</Text> : null}
			  <BottomSheet
			    ref={ref => this.sheet = ref}	
		        snapPoints={[200, 7]}
		        borderRadius={10}		        		       
		        enabledGestureInteraction={gesture}
		        initialSnap={1}
		        onOpenEnd={() => this.setState({gesture:true})}
		        onCloseEnd={() => this.setState({gesture:false})}
		        renderContent={this.renderContent}
		      />
			</>
		)
	}
}