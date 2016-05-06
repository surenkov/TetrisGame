
Array.random = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};

Object.extend = function(destination, source) {
    for (var property in source)
        if (source.hasOwnProperty(property))
            destination[property] = source[property];
    return destination;
};
