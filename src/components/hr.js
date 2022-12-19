/*
* Draws fully customizable dashed lines vertically or horizontally
*
* @providesModule Dash
*/

import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, ViewPropTypes, Text} from 'react-native'
import MeasureMeHOC from 'libs/measureMe'
import { getDashStyle, isStyleRow } from 'libs/util'

const Hr = props => {
	const isRow = isStyleRow(props.style)
	const length = isRow ? props.width : props.height
	const n = Math.ceil(length / (props.dashGap + props.dashLength))
	//const calculatedDashStyles = getDashStyle(props)
	let dash = []	
	for (let i = 0; i < n; i++) {		
		dash.push(
			<Text
				key={ i }
				style={ [			
					props.dashStyle,
					{color:'#000',fontSize:props.size}
				] }
			>{props.pattern}</Text>
		)
	}
	return (
		<View
			onLayout={ props.onLayout }
			style={ [ props.style, isRow ? styles.row : styles.column ] }
		>
			{ dash }
		</View>
	)
}

const styles = StyleSheet.create({
	row: { flexDirection: 'row' },
	column: { flexDirection: 'column' },
})

Hr.propTypes = {
	style: ViewPropTypes.style,
	dashGap: PropTypes.number.isRequired,
	dashLength: PropTypes.number.isRequired,
	dashThickness: PropTypes.number.isRequired,
	dashColor: PropTypes.string,
	dashStyle: ViewPropTypes.style,
	pattern:PropTypes.string
}

Hr.defaultProps = {
	dashGap: 2,
	dashLength: 4,
	dashThickness: 2,
	dashColor: 'black',
	pattern:'*'
}

export default MeasureMeHOC(Hr)