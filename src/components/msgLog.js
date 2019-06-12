export default class Msg{
  constructor(){}
  log(data){
    console.log(data);
    this.postMsg(data);
  }
  postMsg(data){
    $.ajax({
      type: "post",
      url: "https://logstashnrcpb.xueersi.com:5001",
      contentType: "application/json",
      data:JSON.stringify(data),
      success: function success(data) {
        console.log(data)
      },
      error: function error(e) {
        console.log(e,"日志上传失败")
      }
    })
  }
}