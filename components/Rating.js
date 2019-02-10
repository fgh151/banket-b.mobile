import React from "react";
import {View, Image} from "react-native"

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
            this.stars.push(<Image key={i} source={require('../assets/images/star.png')} style={{width:12, height:12}}/>)
        }
        return this.stars;
    };

    render() {
        return(
            <View style={{flex:1, flexDirection: 'row'}}>
                {this.getStars()}
            </View>
        )
    }
}