// 字典数据隔离
function set(id, key, value) {
    let iEVIScache = window.localStorage.__iEVIScache__;
    if (!iEVIScache) {
        iEVIScache = Object.create({});
        iEVIScache[id] = Object.create({});
    } else {
        iEVIScache = JSON.parse(iEVIScache);
        if (!iEVIScache[id]) iEVIScache[id] = Object.create({});
    }
    iEVIScache[id][key] = value;
    window.localStorage.__iEVIScache__ = JSON.stringify(iEVIScache);
}

function get(id, key, dif) {
    let iEVIScache = window.localStorage.__iEVIScache__;
    if (iEVIScache) {
        iEVIScache = JSON.parse(iEVIScache);
        if (iEVIScache[id]) {
            return iEVIScache[id][key] || dif;
        } else {
            return dif;
        }
    } else {
        return dif;
    }
}

function clean(id, key, all) {
    let iEVIScache = window.localStorage.__iEVIScache__;
    if (iEVIScache) {
        iEVIScache = JSON.parse(iEVIScache);
        if (all) {
            if (iEVIScache[id]) delete iEVIScache[id];
        } else {
            if (iEVIScache[id]) {
                if (iEVIScache[id][key]) {
                    delete iEVIScache[id][key];
                }
            }
        }
        window.localStorage.__iEVIScache__ = JSON.stringify(iEVIScache);
    } else {
    }
}

export { set, get, clean };
