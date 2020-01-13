import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import MiniCardComponent from './MiniCardComponent';
import RainDataComponent from './RainDataComponent';
import WindDataComponent from './WindDataComponent';
import GlobalDataComponent from './GlobalDataComponent';

const styles = StyleSheet.create({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {
            marginTop: 0
        }
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 30,
        '@media (max-width: 768px)': {
            marginTop: 30,
            maxWidth: 'none'
        }
    },
    todayTrends: {
        marginTop: 30
    },
    lastRow: {
        marginTop: 30
    },
    unresolvedTickets: {
        marginRight: 30,
        '@media (max-width: 1024px)': {
            marginRight: 0
        }
    },
    tasks: {
        marginTop: 0,
        '@media (max-width: 1024px)': {
            marginTop: 30,
        }
    }
});

function ContentComponent({ weatherData }) {
    return (
        <Column>
            <Row className={css(styles.cardsContainer)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 768: 'column' }}>
                <Row className={css(styles.cardRow)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 384: 'column' }}>
                    <MiniCardComponent className={css(styles.miniCardContainer)} title="Temperature" value={weatherData.temp.temperature == undefined ? "NF" : weatherData.temp.temperature+"°C"} />
                    <MiniCardComponent className={css(styles.miniCardContainer)} title="Humidity" value={weatherData.temp.humidite == undefined ? "NF" : weatherData.temp.humidite+"%"} />
                    <MiniCardComponent className={css(styles.miniCardContainer)} title="Pressure" value={weatherData.press == (undefined || "") ? "NF" : weatherData.press+" PA"} />
                </Row>
            </Row>
            <div className={css(styles.todayTrends)}>
                <GlobalDataComponent weatherGlobalInfoData={weatherData.globalInfo} cityName = {weatherData.city} />
            </div>
            <Row horizontal="space-between" className={css(styles.lastRow)} wrap flexGrow={1} breakpoints={{ 768: 'column' }}>
                <Row className={css(styles.cardRow)} wrap flexGrow={1} horizontal="space-between" breakpoints={{ 384: 'column' }}>
                    <RainDataComponent weatherRainData = {weatherData.rain} containerStyles={styles.unresolvedTickets} />
                    <WindDataComponent weatherWindData = {weatherData.wind} containerStyles={styles.unresolvedTickets} />
                </Row>
            </Row>
        </Column>
    );
}

export default ContentComponent;
