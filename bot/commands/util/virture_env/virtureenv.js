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
    googlekey () 
    {
        let lans = ["type", "project_id","private_key_id","private_key","client_email","client_id","auth_uri","token_uri","auth_provider_x509_cert_url","client_x509_cert_url"]
        let rt = {};
        for(let ee of lans)
        {
            rt[ee] = ve.virtureenv("g_"+ee)
        }
        return rt;
    }
    
}
module.exports = ve