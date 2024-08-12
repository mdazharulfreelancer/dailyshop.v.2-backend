
const  path = require("path")

const getdataUri = (file) =>{


    const extName = path.extname(file.originalName).toString()
    return parser.format(extName, file.buffer)
}

module.exports = getdataUri