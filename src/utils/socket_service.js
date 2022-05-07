export default class SocketService{
    // 单例
    static instance = null
    static get Instance (){
        if (!this.instance){
            this.instance = new SocketService()
        }
        return this.instance
    }
    ws = null
    //定义连接服务器的方法
    connect(){
        if (!window.WebSocket){
            return console.log('您的浏览器不支持websocket')
        }
        this.ws = new WebSocket('ws://localhost:9998')

        //连接成功的事件
        this.ws.onopen =()=>{
            console.log('连接服务器成功了')
        }
        // 连接服务器失败
        this.ws.onclose =()=>{
            console.log('连接服务器失败')
        }
        // 得到服务器发送过来的数据
        this.ws.onmessage =()=>{
            console.log('从服务器获取到了数据')
            // 真正服务端发送过来的原始数据是在msg中的data字段
            console.log(msg.data)
        }
    }
}