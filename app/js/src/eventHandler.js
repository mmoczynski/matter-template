export default {

    on : function (eventName, call) {
        this.eventArrays[eventName].push(call);
    },

    off: function (eventName, call) {
        let i = this.eventArrays[eventName].indexOf(call);
        this.eventArrays[eventName].splice(i, 1);
    },

    callEvent: function (eventName, eventObject) {
        let eventArray = this.eventArrays[eventName];
    
        for (let i = 0; i < eventArray.length; i++) {
            eventArray[i].call(this, eventObject);
        }
    }
};