<template>
  <div id="app">
    <input type="text" v-model="message" placeholder="请输入....">
    <p>{{message}}</p>
  </div>
</template>



<script>

  let socket;



  export default {
    name: 'addStudentPage',
    data() {
      return {
        // 登录用户
        user: '',
        // 消息记录列表
        msgList: [],
        // 发送的消息
        message: {
          time:null,//时间
          to: '',//发给谁
          from: '',
          msg: ''
        },
        // 在线用户列表
        userList: []
      }
    },
    methods: {
      init() {
        // 如果sessionStorage中没有用户信息，则跳转登录页面
        this.user = sessionStorage.getItem('user')
        if (!this.user) {
          this.$router.push('/')
        }
        let that = this;
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          let socketUrl = "ws://localhost:8888/socket/" + this.user;
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
            let data = JSON.parse(msg.data)
            if (data.userNames) {
              // userNames存在则是有人登录，获取在线人员信息
              that.userList = data.userNames
            } else {
              // userNames不存在则是有人发消息
              that.msgList.push(data)
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
        if (!this.message.msg) {
          this.$message({
            message: '大兄弟，请输入聊天消息！',
            type: 'warning'
          });
        } else {
          if (typeof (WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
          } else {
            console.log("您的浏览器支持WebSocket");
            this.message.from=this.user;
            this.message.time=new Date().toLocaleTimeString();
            socket.send(JSON.stringify(this.message));
            this.message.msg = '';
          }
        }
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
