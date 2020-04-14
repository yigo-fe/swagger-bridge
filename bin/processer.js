const axios = require("axios");
const fs = require("fs");
const CodeGen = require("swagger-js-codegen-purvar/lib/founder").CodeGen;
const fn = require("swagger-js-codegen-purvar").fn;

exports.main = async function() {
  const config = fs.readFileSync(__dirname + "/../.swagger-bridge.json");
  let json;
  try {
    json = JSON.parse(config);
  } catch (error) {
    json = {};
  }
  for (const item in json) {
    const url = json[item].url;
    const moduleName = item === 'default' ? '' : item;
    const unittest = json[item].unittest;
    const result = await axios.get(url);
    if (result.data !== undefined ){
      let content = JSON.stringify(result.data);
      
      content = content.replace(/Map«string,object»/gi, "MapObject");
      content = content.replace(/Map«string,List»/gi, "MapObject");
      content = content.replace(/Map«string,List«OptionalData»»/gi, "MapObject");
      content = content.replace(/Map«string,string»/gi, "MapObject");
      content = content.replace(/«/gi, "$").replace(/»/gi, "$");
  
      let swagger = JSON.parse(content);

      CodeGen.getCode({
        moduleName: moduleName,
        className: "",
        swagger: swagger,
        lint: false,
        beautify: false,
        exclude: [],
        unittest: unittest
      });
    }
  }
}
