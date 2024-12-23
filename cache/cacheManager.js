class CacheManager {
    constructor() {
        this.cache = new Map();//url:ObjectResponse
    }

    addCache(key, value) {
        this.cache.set(key,value)
        // console.log(this.cache)
    }

    getCacheByKey(key) {
        
        const entry = this.cache.get(key);

        if (!entry) return null;
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    removeCacheByKey(key) {
        this.cache.delete(key);
    }

    clearAllCache() {
        this.cache.clear();
    }

    getAllKeys() {
        return Array.from(this.cache.keys());
    }

    getCacheSize() {
        return this.cache.size;
    }
}

const cacheManager = new CacheManager();
// cacheManager.addCache("kjd",{
//     body:"hello"
// })
// // console.log(cacheManager.getAllKeys())
// // cacheManager.addCache(2,{
// //     body:"hello"
// // })
// // cacheManager.addCache(1,{
// //     body:"hello"
// // })
// console.log(cacheManager.getAllKeys())

module.exports = cacheManager;
