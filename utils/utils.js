exports.sanitizeMapName = (mapName) => {
    let mapName2 = mapName.replace(/ /g, '-');
    mapName2 = mapName2.replace(/\(/g, '');
    mapName2 = mapName2.replace(/\)/g, '');
    mapName2 = mapName2.replace(/\|/g, '');
    mapName2 = mapName2.replace(/\[/g, '');
    mapName2 = mapName2.replace(/\]/g, '');
    return mapName2
}

/**
 * This is idDoesNotExist because for some reason I cant make the function work like I want it
 * One possible fix would be to do return !array.some--- but thats for another time 
 * @param {string} map name 
 * @param {array} put in json with name as a field  
 * @returns {boolean}
 */
exports.idDoesNotExist = (value, array) => {
    return array.some(e => e.id.toLowerCase() === value.toLowerCase());
}

/**
 * This is nameDoesNotExist because for some reason I cant make the function work like I want it
 * One possible fix would be to do return !array.some--- but thats for another time 
 * @param {string} map name 
 * @param {array} put in json with name as a field  
 * @returns {boolean}
 */
exports.nameDoesNotExist = (value, array) => {
    return array.some(e => e.name.toLowerCase() === value.toLowerCase());
}


exports.getSingleMap = (value, array) => {
    const mapObj = array.filter(map => {
        return map.name.toLowerCase() === value.toLowerCase();
    })
    return mapObj[0];
}