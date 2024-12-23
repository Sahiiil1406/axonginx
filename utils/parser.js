const YAML = require('yamljs');
const fs = require('fs');

const parserYaml=(path)=>{
    const file=fs.readFileSync(path,'utf8');
    fs.writeFileSync('Yamltojson.json',JSON.stringify(YAML.parse(file),null,2));
    // console.log('File created successfully and parsed to JSON');
    // console.log(YAML.parse(file));
    return YAML.parse(file);
}

module.exports=parserYaml;