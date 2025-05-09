const fs = require('fs');

class THashStorage {
    hash = {}; //key - plant, value - how to take care

    #LoadFromStorage() {
        if (fs.existsSync(__dirname + "/" + "db.json")) {
            this.hash = JSON.parse(fs.readFileSync(__dirname + "/" + "db.json"));
        }
    }

    constructor() {
        this.#LoadFromStorage();
    }
    
    Reset() {
        hash = {};
        SaveThisObject();
    }

    #SaveThisObject() {
        let json = JSON.stringify(this.hash);
        fs.writeFileSync(__dirname + "/" + "db.json", json);
    }
    
    AddValue(key, value) {
        if (key in this.hash) {
            throw ("Value is already here: ");
        }
        
        console.log(key, value);
        this.hash[key] = value;
        this.#SaveThisObject();
        return;
    }
    
    EditValue(key, value) {
        if (!(key in this.hash)) {
            throw("No key");
        }

        this.hash[key] = value;
        this.#SaveThisObject();
        return;
    }

    DeleteValue(key) {
        delete this.hash[key];
        this.#SaveThisObject();
    }
    
    GetValue(key) {
        if (key in this.hash) {
            return this.hash[key]; 
        } else {
            throw ("no this key");
        }
    }
    
    GetKeys() {
        return Object.keys(this.hash);
    }

    GetAll() {
        return this.hash;
    }

    PageGet(pagenum, sizeOfPage, toSort, template) {
        let keys = Object.keys(this.hash);

        if (toSort) {
            keys.sort();
        }

        if (template != "") {
            keys = keys.filter(item => item.includes(template));
        }

        let from = sizeOfPage * (pagenum - 1);
        let to = from + sizeOfPage;
        to = Math.min(to, Object.keys(this.hash).length);
        
        let keysToShow = keys.slice(from, to);
        
        let hc = {};
        for (let ke of keysToShow) {
            hc[ke] = this.hash[ke];
        }

        return { "hash" : hc, "pagenum" : pagenum, "maxPages" : Math.ceil(keys.length / sizeOfPage)};
    }
}

module.exports = new THashStorage();