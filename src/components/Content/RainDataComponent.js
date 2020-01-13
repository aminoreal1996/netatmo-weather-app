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
            <CardComponent containerStyles={this.props.containerStyles} title="Rain Informations"
                date={this.props.weatherRainData.rain_timeutc == "" ? "" : Date(this.props.weatherRainData.rain_timeutc)}
                items={[
                    this.renderStat('Rain 60min', this.props.weatherRainData.rain_60min == (null || "") ? "NF" : this.props.weatherRainData.rain_60min),
                    this.renderStat('Rain 24h', this.props.weatherRainData.rain_24h == (null || "") ? "NF" : this.props.weatherRainData.rain_24h),
                    this.renderStat('Rain live', this.props.weatherRainData.rain_live == (null || "") ? "NF" : this.props.weatherRainData.rain_live)
                ]}
            />
        );
    }
}

export default UnresolvedTicketsComponent;
