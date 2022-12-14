const fs = require('node:fs');
class langutil
{
    constructor(lang)
    {
        let langlink = '';
        if(this.supportlang.includes(lang))
        {
            langlink = './langs/'+lang+'.json';
        }
        else
        {
            langlink = './langs/en.json'
        }
        const data = require(langlink);
        this.strs = data;
        this.set_lang = lang;
    }
    set_lang = '';
    strs = {};
    supportlang = ['ko','ja','en'];
    /**
     * <%V%>를 flag로 하여 그 안에 values를 맞춤. 
     * @param {string} strings 대상 string
     * @param {array} values 대체값의 array
     */
    replaceStringVal(strings,values)
    {
        let ret = strings;
        for(let i=1;i<values.length+1;i++)
        {
            ret = ret.replace('<%'+i+'%>',values[i-1]);
        }
        return ret;
    }
    /**
     * lang의 strcode를 반환
     * @param {string} lang 언어
     * @param {string} strcode 언어의 코드
     */
    getLangStr(strcode)
    {
        
        let ser = 'str_'+strcode
        return this.strs.data[ser]
    }
    changeLang(to_lang)
    {
        if(to_lang==this.set_lang)
        {
            return;
        }
        else
        {
            this.set_lang = to_lang;
            const data = require(langlink);
            this.strs = data;
        }
    }

}
module.exports = langutil

