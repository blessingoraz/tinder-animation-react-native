import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder,
    Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

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
            onPanResponderRelease: (event, gesture) => {
                //when a user removes his finger from the screen
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition(); //helper function
                }
            }
        });

        this.state = { panResponder, position };
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION 
        }).start((() => this.onSwipeComplete(direction)));
    }

    onSwipeComplete(direction) {
        const { onSwipeRight, onSwipeLeft } = this.props;
        direction === 'right' ? onSwipeRight() : onSwipeLeft();
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: {x: 0, y: 0}
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH],
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
