import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
	Image,
	View,
	Animated
} from 'react-native';
import { Blurhash } from 'react-native-blurhash';
export default class Image2 extends Component {
    constructor(props) {
     super(props);
     this.opacity = new Animated.Value(1);
     this.visible = true;
    }
    handleLoad = () => {
    	Animated.timing(this.opacity, {
    		toValue:0,
    		useNativeDriver: false
    	}).start(() => {
    		this.visible = false;
    	});
    }
	render() {
	 const {
	  sty,
	  hash,
	  imgSty,
	  source,
	  resizeMode,
	  borderRadius
	 } = this.props;
	 return (
	  <View style={[sty, {borderRadius}]}>
	     <Image resizeMode={resizeMode} source={source} style={[imgSty, {borderRadius}]} onLoad={this.handleLoad} />
	     {this.visible ? <Animated.View style={[{position:'absolute',top:0,left: 0,opacity:this.opacity,borderRadius,overflow:'hidden'}, imgSty]}>
		     <Blurhash
		      blurhash={hash}
		      style={{width: '100%',height: '100%'}}
		    />
	    </Animated.View> : null}
	  </View>
	 )
	}
}