import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	Pressable
} from 'react-native';
import {	
	HeuButton,
	NHeader,
	Table,
	Pulse,
	Icon
} from 'components';
import * as Animatable from 'react-native-animatable';
import Animated from 'react-native-reanimated';
import request from 'libs/request';
import helper from 'assets/helper';
import lang from 'assets/lang';
const tvH = helper.height - 100;
const tvW = helper.width;
const fixedWidth = 31;
const fixedHeight = 18;
const table = require('assets/images/tvTable.png');

const SQUARE = 50;
const R_LESS = [60, 35];
const R_MORE = [50, 32];
const CIRCLE = 200;
const ROUND = 10;

export default class TableSelectionView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected:[],
			tables:[],
			maX:0,
			maY:0,
			dynaW:tvW,
			dynaH:tvH
		}
		this.table = [];
	}
	componentDidMount() {
		this.loadTables();
	}
	loadTables = async () => {	    
		this.setState({loading:true,error:false,tables:[]})
		var res = await request.perform('vendor', {
			req:'ld_tbls',
			f_id:this.props.route.params.id,
			user_id,
			s
		});		
		if(res)this.setState({loading:false});
		if(typeof res === 'object' && res?.status == 200)
			 this.setState({tables:res.data});			
		else this.setState({error:true});
	}
	onSelect = (idx) => {		
		let selected = this.state.selected;
		let slx = this.state.selected.indexOf(idx);
		if(slx != -1){
			selected.splice(slx, 1)
		}else{
			selected.push(idx)
			this.tbTv.tada();
		}
		if(selected.length == 0)
			this.doneBtn.zoomOut();
		else if(selected.length == 1 && slx == -1)
			this.doneBtn.zoomIn();

		this.setState({selected,disabled:selected.length == 0})
	}
	onGX = (dynaW) => {
		if(this.state.dynaW < dynaW)
			this.setState({dynaW})
	}
	onGY = (dynaH) => {
		if(this.state.dynaH < dynaH)
			this.setState({dynaH})
	}
	render () {
		const {dynaW, dynaH, tables, selected} = this.state;
		const scale = 1;		
		const len = selected.length;		
		return (
			<View style={s.viewPort}>
                <NHeader title={lang.z[cl].slt_tbl} />
				<View style={s.tableViewer}>
					<ScrollView>
					<ScrollView horizontal={true}>
					
					<View style={{width:dynaW,height:dynaH,transform:[{scale}]}}>
					 {tables.map((table, index) => {
					 	return(
					 		<Table
				     		   x={table.x}
				     		   y={table.y}
				     		   index={index}
				     		   key={table.id}
				     		   id={table.id}
						       areaX={helper.height}
							   areaY={helper.width}
							   onGX={this.onGX}
							   onGY={this.onGY}
							   onChange={cd => this.hdlTblChg(cd, table, index)}							   							   
						       numChairs={table.chairs}
						       ref={ref => this.table[index] = ref} 
						 	   onSelect={() => this.onSelect(index)} 
						    />
					 	);
					 })}
					</View>

					</ScrollView>
					</ScrollView>
				</View>
				<View style={s.ftr}>
				 <Animatable.Text ref={ref => this.tbTv = ref} style={s.tt}>
				 	{len} <Text style={s.dd}> Tables Selected</Text>
				 </Animatable.Text>

				 <Animatable.View style={s.sbtn} animation="zoomOut" ref={ref => this.doneBtn = ref}>
				  <HeuButton style={s.st}><Icon name={lang.arwfrw} color="white" size={25} /></HeuButton>
				 </Animatable.View>

				</View>
			</View>
		)
	}
}


const s = StyleSheet.create({
	ftr:{height:50,alignItems:'center',width:'100%',backgroundColor:'black',flexDirection:'row'},
	viewPort:{flex:1,backgroundColor:helper.grey2},
	tableViewer:{width:tvW,height:tvH,justifyContent:"center",alignItems:'center'},
	tt:{marginLeft:5,fontSize:22,color:helper.primaryColor,fontWeight:'bold'},
	dd:{fontSize:15,color:helper.primaryColor},
	table:{width:140,height:80, position: 'absolute'},
	badge:{position:'absolute',top:'35%',left:'42%',width:22,height:22,backgroundColor:helper.primaryColor,elevation:9,borderRadius:100,justifyContent:'center',alignItems:'center'},
	btxt:{fontSize:13,fontWeight:'bold',color:'#fff'},
	sbtn:{position: 'absolute',right:5,top:10},
	st:{height:35,width:35,backgroundColor:helper.primaryColor,borderRadius:100,justifyContent:'center',alignItems:'center'}
})