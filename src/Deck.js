import React, { Component } from 'react';
import { View, Animated } from 'react-native';

export default class Deck extends Component {
    renderCards() {
        return this.props.data.map((item, index) => {
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
