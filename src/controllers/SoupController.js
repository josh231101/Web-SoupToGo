const Soup = require('../models/Soup');

module.exports = {
    async getAllSoups(){
        try {
            const soups = await Soup.find();
            return soups
        } catch (error) {
            return false
        }
    },
    async getSoupsByQuery(query,nSoups){
        if(nSoups){
            return Soup.find(query).limit(nSoups);
        }
        return await Soup.find(query);
    },
    async getSoupById(id){
        try {
            const soupById = await Soup.findOne({_id : id});
            return soupById
        } catch (error) {
            return false
        }
    },
    
}