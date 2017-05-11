import config from './config';
import enUS from '../assets/strings/en_US.json';

export const centerGameObjects = (objects) => { // eslint-disable-line import/prefer-default-export
    objects.forEach((object) => {
        object.anchor.setTo(0.5);
    });
};

function getLocalizedDictionary(locale) {
    switch (locale) {
        default:
            return enUS;
    }
}
export function getLocalized(key) {
    const dict = getLocalizedDictionary(config.localization);
    const value = key.split('.').reduce((a, b) => a[b], dict);
    return value || '';
}

export function csvToArray(csv) {
    const rows = csv.split('\n');
    return rows.map(row => row.split(','));
}

export function defaultTextStyle(fontSize) {
    return {
        font: 'Roboto',
        fontSize: fontSize || 30,
        fill: '#fff',
        align: 'right',
        stroke: 'rgba(0,0,0,0)',
        strokeThickness: 4,
    };
}
