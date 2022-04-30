<template>
  <div>
    <h1>交谈</h1>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        // 登录用户
        user:'张三',
        // 消息列表
        msgList:[],
        // 消息
        message:{},
        // 在线用户列表
        userList:[]
      }
    },
    methods:{
      init() {
        // 如果sessionStorage中没有用户信息，则跳转登录页面
        this.user = JSON.parse(sessionStorage.getItem('user'));
        if (!this.user) {
          this.$router.push('/')
        }
        let that = this;
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          let socketUrl = "ws://192.168.2.80:8888/imserverSimple/" + username;
          if (socket != null) {
            socket.close();
            socket = null;
          }
          // 开启一个websocket服务
          socket = new WebSocket(socketUrl);
          //打开事件
          socket.onopen = function () {
            console.log("websocket已打开");
          };
          //  浏览器端收消息，获得从服务端发送过来的文本消息
          socket.onmessage = function (msg) {
            console.log("收到数据====" + msg.data)
            let data = JSON.parse(msg.data)  // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
            if (data.users) {  // 获取在线人员信息
              that.userList = data.users.filter(user => user.username !== that.user.username)  // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
            } else {
              // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
              //  // {"from": "zhang", "text": "hello"}
              if (data.from === that.chatName) {
                that.msgList.push({time:new Date().toLocaleTimeString(),name:data.from,text:data.text})
              }
            }
          };
          //关闭事件
          socket.onclose = function () {
            console.log("websocket已关闭");
          };
          //发生了错误事件
          socket.onerror = function () {
            console.log("websocket发生了错误");
          }
        }
      },
      send() {
        let that=this;
        if(this.chatName==='请选择对话用户'){
          this.$Message.info('请选择聊天对象');
          this.text='';
          return;
        }
        if (!this.text) {
          this.$Message.info('请输入聊天内容');
        } else {
          if (typeof (WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
          } else {
            console.log("您的浏览器支持WebSocket");
            // 组装待发送的消息 json
            // {"from": "zhang", "to": "admin", "text": "聊天文本"}
            let message = {from: this.user.username, to: this.chatName, text: this.text}
            socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
            //把消息放入集合中
            let msg={time:new Date().toLocaleTimeString(),name:this.user.username,text:this.text}
            that.msgList.push(msg)
            // 构建消息内容，本人消息
            console.log(that.msgList)
            this.text = '';
          }
        }
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
