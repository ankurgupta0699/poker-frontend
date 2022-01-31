function snakeToCamel(string) {
    return string.replace(/(_\w)/g, function(m){
        return m[1].toUpperCase();
    });
}

function camelToSnake(string) {
    return string.replace(/[\w]([A-Z])/g, function(m) {
        return m[0] + "_" + m[1];
    }).toLowerCase();
}
