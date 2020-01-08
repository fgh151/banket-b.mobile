import React from "react";
import {Image, StyleSheet, View} from "react-native"

export default class Rating extends React.Component{

    state = {
        points: 0
    };

    stars = [];

    componentDidMount() {
        let rating = Math.round(this.props.rating / 2);
        this.setState({points: rating});
    }

    getStars = () => {
        this.stars=[];
        for (let i = 0; i < this.state.points; i++) {
            this.stars.push(<Image key={i} source={require('../assets/images/star.png')} style={style.star}/>)
        }
        return this.stars;
    };

    render() {
        return (
            <View style={style.wrapper}>
                {this.getStars()}
            </View>
        )
    }
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    star: {
        width: 12,
        height: 12,
        marginRight: 3
    }
});
