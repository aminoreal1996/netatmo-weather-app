import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import ParisPicture from '../../assets/parisPicture.jpg';
import NewYorkPicture from '../../assets/newyorkPicture.jpg';
import BerlinPicture from '../../assets/berlinPicture.jpg';
import BogotaPicture from '../../assets/bogotaPicture.jpg';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #DFE0EB',
        borderRadius: 4,
        cursor: 'pointer'
    },
    graphContainer: {
        marginTop: 24,
        marginLeft: 0,
        marginRight: 0,
   
    },
    graphSection: {
        padding: 24
    },
    graphSubtitle: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: '16px',
        letterSpacing: '0.1px',
        color: '#9FA2B4',
        marginTop: 4,
        marginRight: 8
    },
    graphTitle: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 19,
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: '#252733'
    },
    legendTitle: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: '15px',
        letterSpacing: '0.1px',
        color: '#9FA2B4',
        marginLeft: 8
    },
    separator: {
        backgroundColor: '#DFE0EB',
        width: 1,
        minWidth: 1,
    },
    statContainer: {
        borderBottom: '1px solid #DFE0EB',
        padding: '24px 32px 24px 32px',
        height: 'calc(114px - 48px)',
        ':last-child': {
            border: 'none'
        }
    },
    stats: {
        borderTop: '1px solid #DFE0EB',
        width: '100%'
    },
    statTitle: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: '22px',
        letterSpacing: '0.3px',
        textAlign: 'center',
        color: '#9FA2B4',
        whiteSpace: 'nowrap',
        marginBottom: 6
    },
    statValue: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: '30px',
        letterSpacing: '0.3px',
        textAlign: 'center',
        color: '#252733'
    }
});

class GlobalDataComponent extends React.Component {

    renderLegend(color, title) {
        return (<Row vertical="center">
            <div style={{ width: 16, border: '2px solid', borderColor: color }}></div>
            <span className={css(styles.legendTitle)}>{title}</span>
        </Row>);
    }

    renderStat(title, value) {
        return (<Column flexGrow={1} className={css(styles.statContainer)} vertical="center" horizontal="center">
            <span className={css(styles.statTitle)}>{title}</span>
            <span className={css(styles.statValue)}>{value}</span>
        </Column>);
    }

    render() {
        return (
            <Row flexGrow={1} className={css(styles.container)}
                horizontal="center" breakpoints={{ 1024: 'column' }}>
                <Column wrap flexGrow={7} flexBasis="735px" className={css(styles.graphSection)}
                    breakpoints={{ 1024: { width: 'calc(100% - 48px)', flexBasis: 'auto' } }}>
                    
                    <div className={css(styles.graphContainer)}>
                    <Row wrap horizontal="space-between" width="" >
                        {this.props.cityName == "Paris" ? <img src={ParisPicture} style={{width:"100%", height:"70%"}} /> : null}
                        {this.props.cityName == "New York" ? <img src={NewYorkPicture} style={{width:"100%", height:"70%"}} /> : null}
                        {this.props.cityName == "Berlin" ? <img src={BerlinPicture} style={{width:"100%", height:"70%"}} /> : null}
                        {this.props.cityName == "Bogota" ? <img src={BogotaPicture} style={{width:"100%", height:"70%"}} /> : null}
                    </Row>
                    </div>
                </Column>
                <Column className={css(styles.separator)} breakpoints={{ 1024: { display: 'none' } }}><div /></Column>
                <Column flexGrow={3} flexBasis="342px" breakpoints={{ 1024: css(styles.stats) }}>
                    {this.renderStat('location', this.props.weatherGlobalInfoData.location.longitude + "/" + this.props.weatherGlobalInfoData.location.latitude)}
                    {this.renderStat('timezone', this.props.weatherGlobalInfoData.timezone)}
                    {this.renderStat('country', this.props.weatherGlobalInfoData.country)}
                    {this.renderStat('altitude', this.props.weatherGlobalInfoData.altitude)}
                    {this.renderStat('street', this.props.weatherGlobalInfoData.street)}
                </Column>
            </Row>
        );
    }
}

export default GlobalDataComponent;
