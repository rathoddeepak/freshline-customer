import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Pressable,
	View
} from 'react-native';
import LottieView from 'lottie-react-native';
import helper from 'assets/helper';
const anim = '{"v":"4.12.3","fr":29.9700012207031,"ip":0,"op":150.000006109625,"w":600,"h":600,"nm":"checkbox","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"シェイプレイヤー 2","td":1,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[300,300,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[-79,-2.5],[-28,46],[81.5,-47]],"c":false},"ix":2},"nm":"パス 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[1,1,1,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":20,"ix":5},"lc":1,"lj":1,"ml":4,"nm":"線 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"トランスフォーム"}],"nm":"シェイプ 1","np":3,"cix":2,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":0,"k":0,"ix":1},"e":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"n":["0_1_0p333_0"],"t":30,"s":[0],"e":[100]},{"i":{"x":[0],"y":[1]},"o":{"x":[0.167],"y":[0]},"n":["0_1_0p167_0"],"t":50,"s":[100],"e":[100]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[1],"y":[0]},"n":["0p667_1_1_0"],"t":90,"s":[100],"e":[0]},{"t":110.000004480392}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"パスのトリミング 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":300.00001221925,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"シェイプレイヤー 1","tt":2,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[300,300,0],"ix":2},"a":{"a":0,"k":[-31.488,38.512,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":1,"k":[{"i":{"x":[0,0],"y":[1,1]},"o":{"x":[0.333,0.333],"y":[0,0]},"n":["0_1_0p333_0","0_1_0p333_0"],"t":30,"s":[237.023,237.023],"e":[257.023,257.023]},{"i":{"x":[0,0],"y":[1,1]},"o":{"x":[0.167,0.167],"y":[0,0]},"n":["0_1_0p167_0","0_1_0p167_0"],"t":45,"s":[257.023,257.023],"e":[257.023,257.023]},{"i":{"x":[0.667,0.667],"y":[1,1]},"o":{"x":[1,1],"y":[0,0]},"n":["0p667_1_1_0","0p667_1_1_0"],"t":95,"s":[257.023,257.023],"e":[237.023,237.023]},{"t":110.000004480392}],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"r":{"a":0,"k":20,"ix":4},"nm":"長方形パス 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"st","c":{"a":0,"k":[0.459,0.459,0.459,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"n":["0_1_0p333_0"],"t":30,"s":[20],"e":[0]},{"i":{"x":[0],"y":[1]},"o":{"x":[0.167],"y":[0]},"n":["0_1_0p167_0"],"t":45,"s":[0],"e":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[1],"y":[0]},"n":["0p667_1_1_0"],"t":95,"s":[0],"e":[20]},{"t":110.000004480392}],"ix":5},"lc":1,"lj":1,"ml":4,"nm":"線 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"fl","c":{"a":0,"k":[0.8156862745098039, 0.6666666666666666, 0.27058823529411763, 1],"ix":4},"o":{"a":1,"k":[{"i":{"x":[0],"y":[1]},"o":{"x":[0.333],"y":[0]},"n":["0_1_0p333_0"],"t":30,"s":[0],"e":[100]},{"i":{"x":[0],"y":[1]},"o":{"x":[0.167],"y":[0]},"n":["0_1_0p167_0"],"t":40,"s":[100],"e":[100]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[1],"y":[0]},"n":["0p667_1_1_0"],"t":100,"s":[100],"e":[0]},{"t":110.000004480392}],"ix":5},"r":1,"nm":"塗り 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[-31.488,38.512],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"トランスフォーム"}],"nm":"長方形 1","np":3,"cix":2,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":300.00001221925,"st":0,"bm":0}]}';
function h (value) {
	switch (value){
		case 'A':
		case 'a':
		return 10;
		case 'B':
		case 'b':
		return 11;
		case 'C':
		case 'c':
		return 12;
		case 'D':
		case 'd':
		return 13;
		case 'E':
		case 'e':
		return 14;
		case 'F':
		case 'f':
		return 15;
		default:
		return parseInt(value);
	}
}
function l(a, b){
	return ((a * 16) + b) / 255;
}
const border = '#757575';
export default class Checkbox extends Component {	
	constructor(props){
		super(props);
		this.state = {
			animation:false,
			current:false
		}		
	}
	componentDidMount() {
		let c = this.props.color;
		let b = this.props.borderColor;		
		let zebra = JSON.parse(anim);
		if(border != b){
			zebra['layers'][1]['shapes'][0]['it'][1]['c']['k'] = [
			 l(h(b[1]), h(b[2])),
			 l(h(b[3]), h(b[4])),
			 l(h(b[5]), h(b[6])),
			 1
			];
		}
		// if(c != helper.primaryColor){
			zebra['nm'] = c;
			zebra['layers'][1]['shapes'][0]['it'][2]['c']['k'] = [
			 l(h(c[1]), h(c[2])),
			 l(h(c[3]), h(c[4])),
			 l(h(c[5]), h(c[6])),
			 1
			];
		// }
		this.setState({animation:zebra}, () => {
			if(this.props.selected)this.handlePress(false);
		});
	}
	handlePress = (manaul) => {
		let c = this.state.current;
		if(c)this.lottie.play(91, 125);
		else this.lottie.play(26, 53);
		this.setState({current:!c})		
		if(this.props?.onChange != undefined && manaul)
			this.props.onChange(!c);
	}
	render() {
		const {
			size,
			style			
		} = this.props;		
		return (
			<Pressable onPress={this.handlePress} style={[{width:size,height:size}, style]}>
				{this.state.animation ? <LottieView
				    ref={ref => (this.lottie = ref)}
				    loop={false}				
				    speed={1.5}
					style={{width:size + 28,height:size + 28,top:-7,left:-7}}
					source={this.state.animation}
				/> : <View></View>}				
			</Pressable>
		)
	}
}

Checkbox.propTypes = {
	size: PropTypes.number,
	color: PropTypes.string,
	borderColor: PropTypes.string,
	style: PropTypes.object,
	selected: PropTypes.bool
}

Checkbox.defaultProps = {
	size:25,
	borderColor:border,
	color:helper.primaryColor,
	style:{},
	selected:false
}