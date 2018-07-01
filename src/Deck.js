import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder
} from 'react-native';

export default class Deck extends Component {
    constructor(props) {
        super(props);
        
        //This is for animated the touched(gesture/panResponder) component 
        const position = new Animated.ValueXY();

        //create instance of panResponder
        //local variable of panResponder
        //Need to reference this by assigning to state
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: () => {

            }
        });

        this.state = { panResponder, position };
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-500, 0, 500],
            outputRange: [ '-120deg', '0deg', '120deg']
        });
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        }
    }

    renderCards() {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        style={this.getCardStyle()}
                        {...this.state.panResponder.panHandlers}>
                        {this.props.renderCard(item, index)}
                    </Animated.View>
                )
            }
            return this.props.renderCard(item, index);
        });
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        )
    }
}
