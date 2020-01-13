import React from 'react';
import { Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import CardComponent from './CardComponent';

const styles = StyleSheet.create({
    itemTitle: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#252733'
    },
    itemValue: {
        color: '#9FA2B4'
    }
});

class UnresolvedTicketsComponent extends React.Component {

    renderStat(title, value) {
        return (<Row flexGrow={1} horizontal="space-between" vertical="center">
            <span className={css(styles.itemTitle)}>{title}</span>
            <span className={css(styles.itemTitle, styles.itemValue)}>{value}</span>
        </Row>);
    }

    render() {
        return (
            <CardComponent containerStyles={this.props.containerStyles} title="Wind Informations"
                date={this.props.weatherWindData.wind_timeutc == "" ? "" : Date(this.props.weatherWindData.wind_timeutc)}
                items={[
                    this.renderStat('Wind strength', this.props.weatherWindData.wind_strength == (null || "") ? "NF" : this.props.weatherWindData.wind_strength ),
                    this.renderStat('wind angle', this.props.weatherWindData.wind_angle == (null || "") ? "NF" : this.props.weatherWindData.wind_angle ),
                    this.renderStat('Gust strength', this.props.weatherWindData.gust_strength == (null || "") ? "NF" : this.props.weatherWindData.gust_strength ),
                    this.renderStat('Gust angle', this.props.weatherWindData.gust_angle == (null || "") ? "NF" : this.props.weatherWindData.gust_angle )
                ]}
            />
        );
    }
}

export default UnresolvedTicketsComponent;
