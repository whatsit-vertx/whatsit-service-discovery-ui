function getWsPath() {
    const loc = window.location;
    let path;
    if (loc.protocol === "https") {
        path = "wss://";
    } else {
        path = "ws://";
    }

    return path + loc.host + "/discovery?";
}

const Global = {
    wsPath: process.env.NODE_ENV==='development' ? "ws://localhost:8080/discovery?" : getWsPath()
}

export default Global;
