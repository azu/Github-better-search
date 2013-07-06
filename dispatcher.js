var dispatcher = {
    location: window.location,
    stash   : [],

    connect: function(paths, action) {
        if (paths || paths === 0) {
            paths = paths.valueOf();
            if (!(typeof paths == 'object' && !(paths instanceof RegExp))) // webkit: typeof RegExp == 'function'
                paths = { pathname: paths };
            dispatcher.stash.push([paths, action]);
        }
        return dispatcher;
    },

    and: function() {
        var stash = dispatcher.stash,
            length = stash.length;
        length && (stash[length - 1][2] = true);
        return dispatcher;
    },

    dispatch: function(location) {
        location = location || dispatcher.location;
        var stash = dispatcher.stash,
            params = {};
        for (var i = 0, c; c = stash[i]; ++i) {
            var paths = c[0], action = c[1], chain = c[2];
            var matched = false;
            for (var k in paths) {
                var v = paths[k];
                var path = location[k];
                if (!path) continue;
                var m = dispatcher.match(v, path);
                matched = !!m;
                if (matched)
                    params[k] = m;
                else
                    break;
            }
            if (matched) {
                if (action)
                    action(params);
                if (!chain) break;
            }
        }
        dispatcher.clear();
        return dispatcher;
    },

    match: function(value, path) {
        var ret;
        if (value instanceof RegExp)
            ret = value.exec(path) || false;
        else {
            value = value.toString();
            ret = (path.indexOf(value) != -1) && value;
        }
        return ret;
    },

    clear: function() {
        dispatcher.stash = [];
        return dispatcher;
    }
};
