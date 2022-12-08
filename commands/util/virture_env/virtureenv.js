const fs = require('node:fs');
const { version } = require('node:os');
ve = class
{
    constructor()
    {
        if(process.env.IS_REAL_SERVER)
        {
            this.isreal = true
        }
        else
        {
            this.isreal = false
        }
    }
    virtureenv(name) 
    {
        try
        {
            
            if(this.isreal)
            {
                return process.env[name]
            }
            else
            {
                return require('./security/virture_env.json')[name]
            }
        }
        catch(e)
        {
            console.log(e)
            return e;
        }
              
    }
    
}
module.exports = ve