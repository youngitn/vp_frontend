export default class Funcs {
    constructor() { 
        // eslint-disable-next-line no-extend-native
        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + days);
            return this;
          }
    }

    /**
     * 取一個月前日期
     *
     * @param {*} n
     * @returns
     * @memberof Funcs
     */
    getOneMonthAgoDate (n){
        var d = new Date();
        d.setMonth(d.getMonth() - n);
        var month = d.getMonth() + 1;
        var day = d.getDate();
    
        var output = d.getFullYear() + '/' +
          (month < 10 ? '0' : '') + month + '/' +
          (day < 10 ? '0' : '') + day;
        return output;
      }

      
      /**
       * 根據參數增減日期
       *
       * @param {*} n
       * @returns
       * @memberof Funcs
       */
      getDateByAfterDays (n) {
        var d = new Date();
        // 
        d.addDays(n);
        //d.setMonth(d.getMonth());
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = d.getFullYear() + '/' +
          (month < 10 ? '0' : '') + month + '/' +
          (day < 10 ? '0' : '') + day;
        return output;
      }

    /**
     *給async function中,用await設定sleep時間
     *必須包含在給async中,並在呼叫時冠上await前墜
     * @param {*} t 
     * @returns
     * @memberof Funcs
     */
    delay(t) {
        return new Promise(resolve => {
            //setTimeout(function () {resolve(this.getTobePickedShippingInfoList())},t); 

            setTimeout(resolve, t);

        }).then(onfulfilled => console.log('delay over'))
    }
}




