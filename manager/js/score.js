window.onload = function(){
  init_data();
}

var base_url = 'http://134.175.152.210:8084';

// 初始化数据
function init_data(){
  // 获取所有批次
  getAllBatch_StuList();
  // 获取所有工种
  getAllProced();
  // // 根据条件查询成绩列表
  // getScoreList();
  // 查询教师提交成绩记录--初始化
  getScoreRecord();
}

// 1、 成绩列表

// 获取所有批次
function getAllBatch_StuList(){
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllBatch',
    datatype: 'json',
    data: {},
    beforeSend: function(xhr) {
      xhr.withCredentials = true;
    },
    crossDomain:true,
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        html = "<option>实习批次选择</option>";
        for(let i=0; i<data.data.length; i++){
          html += '<option>'+data.data[i].batch_name+'</option>';
        }
        // console.log(html);
        $('#score_list_select_batch').html(html);
        $('#score_list_select_batch2').html(html);
        $('#input_score_select_batch').html(html);
        $('#score_submit_select_batch').html(html);
        $('#score_edithistory_select_batch').html(html);
      }
    }
  });
}
// 获取所有工种
function getAllProced(){
  $.ajax({
    type: 'post',
    url: base_url + '/proced/getAllProced',
    datatype: 'json',
    data: {},
    success: function(data){
      if(data.status === 0){
        let data_arr = data.data;
        let html = '<option>选择工种</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>';
        }
        $('#score_list_select_process').html(html);
        $('#input_score_select_scoreitem').html(html);
        $('#score_submit_select_process').html(html);
      }
    }
  });
}
// 根据批次获取对应的分组号--成绩列表
function getAllSGroupByBatch(){
  let batch_name = $('#score_list_select_batch').val();
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllSGroup',
    datatype: 'json',
    data: {
      'batch_name': batch_name
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        let data_arr = data.data;
        let html = '<option>组号</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>'
        }
        $('#score_list_select_group_number').html(html);
      }
    }
  });
}
$('#score_list_select_batch').change(function(){
  // 根据批次获取对应的分组号--成绩列表
  getAllSGroupByBatch();
  // 根据条件查询成绩列表
  getScoreList();
})

// 根据批次获取对应的分组号--成绩提交记录
function getAllSGroupByBatch(){
  let batch_name = $('#score_submit_select_batch').val();
  $.ajax({
    type: 'post',
    url: base_url + '/batch/getAllSGroup',
    datatype: 'json',
    data: {
      'batch_name': batch_name
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);
        let data_arr = data.data;
        let html = '<option>组号</option>';
        for(let i=0; i<data_arr.length; i++){
          html += '<option>'+data_arr[i]+'</option>'
        }
        $('#score_submit_select_groupid').html(html);
      }
    }
  });
}
$('#score_submit_select_batch').change(function(){
  // 根据批次获取对应的分组号--成绩提交记录
  getAllSGroupByBatch();
})


// 根据条件查询成绩列表【接口有问题】
function getScoreList(){
  let batch_name = $('#score_list_select_batch').val();
  let s_group_id = $('#score_list_select_group_number').val();
  let pro_name = $('#score_list_select_process').val();
  let sId = $('#score_list_stu_number').val();
  let sName = $('#score_list_stu_name').val();
  if(batch_name === "实习批次选择"){
    batch_name = null;
  }
  if(s_group_id === "组号"){
    s_group_id = null;
  }
  if(pro_name === "选择工种"){
    pro_name = null;
  }
  if(sId === ""){
    sId = null;
  }
  if(sName === ""){
    sName = null;
  }
  console.log(batch_name);
  console.log(s_group_id);
  console.log(pro_name);
  console.log(sId);
  console.log(sName);
  $.ajax({
    type: 'post',
    url: base_url + '/score/getScore',
    datatype: 'json',
    data: {
      'batch_name': batch_name,
      's_group_id': s_group_id,
      'pro_name': pro_name,
      'sId': sId,
      'sName': sName
    },
    success: function(data){
      if(data.status === 0){
        // console.log(data);

      }
    }
  });
}

// 核算总成绩
function executeScore(){
  let batch_name = $('#score_list_select_batch').val();
  if(batch_name === "实习批次选择"){
    swal(
      '请先选择批次',
      '请选择对应批次后核算成绩！',
      'warning'
    );
  }
  else{
    $.ajax({
      type: 'post',
      url: base_url + '/score/executeScore',
      datatype: 'json',
      data: {
        'batch_name': batch_name
      },
      success: function(data){
        if(data.status === 0){
          // console.log(data);
          swal(
            '核算成功',
            '批次'+batch_name+'核算成绩成功！',
            'success'
          );
          // 刷新成绩列表
          getScoreList();
        }
        else{
          console.log(data);
          swal(
            '核算失败',
            String(data.message),
            'error'
          );
        }
      }
    });
  }
}

// 等级评定面板内容根据设置模式改变（按照成绩总排名划分/按照成绩总分数划分）
$('#setDegreeModal').change(function(){
  let html = '';
  let modal = $('#setDegreeModal').val();
  if(modal === "按照成绩总排名划分"){
    html += '<tr><td>优秀</td><td><input type="text" name="" id="setDegreeTable_great"> %</td></tr>';
    html += '<tr><td>良好</td><td><input type="text" name="" id="setDegreeTable_good"> %</td></tr>';
    html += '<tr><td>中等</td><td><input type="text" name="" id="setDegreeTable_middle"> %</td></tr>';
    html += '<tr><td>及格</td><td><input type="text" name="" id="setDegreeTable_pass"> %</td></tr>';
    html += '<tr><td>不及格</td><td><input type="text" name="" id="setDegreeTable_notPass"> %</td></tr>';
  }
  else if(modal === "按照成绩总分数划分"){
    html += '<tr><td>优秀</td><td><input type="text" name="" id="setDegreeTable_great"> 分</td></tr>';
    html += '<tr><td>良好</td><td><input type="text" name="" id="setDegreeTable_good"> 分</td></tr>';
    html += '<tr><td>中等</td><td><input type="text" name="" id="setDegreeTable_middle"> 分</td></tr>';
    html += '<tr><td>及格</td><td><input type="text" name="" id="setDegreeTable_pass"> 分</td></tr>';
    html += '<tr><td>不及格</td><td><input type="text" name="" id="setDegreeTable_notPass"> 分</td></tr>';
  }
  $('#setDegreeTable').html(html);
})

// 等级设置
function setDegree(){
  let modal = $('#setDegreeModal').val();
  if(modal === "按照成绩总排名划分"){
    modal = "percent";
  }
  else if(modal === "按照成绩总分数划分"){
    modal = "score";
  }
  let batch_name = $('#score_list_select_batch').val();
  if(batch_name === "实习批次选择"){
    swal(
      '请先选择批次',
      '请选择对应批次后核算成绩！',
      'warning'
    );
  }
  else{
    let great = $('#setDegreeTable_great').val();
    let good = $('#setDegreeTable_good').val();
    let middle = $('#setDegreeTable_middle').val();
    let pass = $('#setDegreeTable_pass').val();
    let notPass = $('#setDegreeTable_notPass').val();
    let degreeForm = {
      "batchName": batch_name,
      "good": great,
      "great": good,
      "middle": middle,
      "notPass": pass,
      "pass": notPass
    };
    $.ajax({
      type: 'post',
      url: base_url + '/score/setDegree?way='+modal,
      datatype: 'json',
      contentType: "application/json",
      data: JSON.stringify(degreeForm),
      success: function(data){
        if(data.status === 0){
          // console.log(data);
          swal(
            '设置成功',
            '等级设置成功！',
            'success'
          );
          // 刷新成绩列表
          getScoreList();
        }
        else{
          console.log(data);
          swal(
            '设置失败',
            String(data.message),
            'error'
          );
        }
      }
    });
  }
}

// 修改一个学生的成绩【等查询接口完成后才能写了】
function editOneStuScore(obj){

}

// 发布某个批次的总成绩【还没有接口】
function publishScore(){

}


// 2、成绩批量导入

// 下载标准模版【有问题！！！】
function downloadTemplate(){
  $.ajax({
    type: 'post',
    url: base_url + '/admin/download',
    // datatype: 'json',
    // data: {},
    success: function(result){
      // 创建a标签，设置属性，并触发点击下载
      var $a = $("<a>");
      $a.attr("href", result.data.file);
      $a.attr("download", result.data.filename);
      $("body").append($a);
      $a[0].click();
      $a.remove();
    }
  });
}

// 上传文件导入学生信息【有问题！！！】
function importStudentsScore(){
  var form = new FormData(document.getElementById("tf"));
  let batchName = $('#input_score_select_batch').val();
  let scoreitem = $('#input_score_select_scoreitem').val();
  form.append("batch_name", batchName);
  form.append("pro_name", scoreitem);
  console.log(form);
  $.ajax({
      url: base_url + "/admin/importStudents",
      type: "post",
      data: form,
      processData: false,
      contentType: false,
      success:function(data){
          // window.clearInterval(timer);
          console.log("over..");
          $('#tf').empty();
          init_data();
      },
      error:function(e){
          alert("错误！！");
          // window.clearInterval(timer);
      }
  });
}


// 3、成绩提交记录

// 查询教师提交成绩记录
function getScoreRecord(){
  let batch_name = $('#score_submit_select_batch').val();
  let pro_name = $('#score_submit_select_process').val();
  let s_group_id = $('#score_submit_select_groupid').val();
  send_data = {};
  if(batch_name !== "实习批次选择" & batch_name !== null){
    send_data.batch_name = batch_name;
  }
  if(pro_name !== "选择工种" & pro_name !== null){
    send_data.pro_name = pro_name;
  }
  if(s_group_id !== "组号" & s_group_id !== null){
    send_data.s_group_id = s_group_id;
  }
  console.log(send_data);
  $.ajax({
    type: 'post',
    url: base_url + '/score/getScoreRecord',
    datatype: 'json',
    data: send_data,
    success: function(data){
      if(data.status === 0){
        console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td>'+chGMT(data_arr[i].submit_time)+'</td><td>'+data_arr[i].batch_name+'</td><td>'+data_arr[i].s_group_id+'</td><td>'+data_arr[i].pro_name+'</td><td>'+data_arr[i].tid+'</td></tr>';
        }
        $('#score_submit_list').html(html);
      }
    }
  });
}


// 4、成绩修改记录【暂无接口】
function searchUpdateHistory(){

}


// 5、特殊学生成绩列表

// 特殊学生成绩查询【接口缺少数据】
function getSpScore(){
  let sid = $('#spStu_sid').val();
  let sname = $('#spStu_sname').val();
  send_data = {};
  if(sid !== null){
    send_data.sid = sid;
  }
  if(sname !== null){
    send_data.sname = sname;
  }
  console.log(send_data);
  $.ajax({
    type: 'post',
    url: base_url + '/score/getSpScore',
    datatype: 'json',
    data: send_data,
    success: function(data){
      if(data.status === 0){
        console.log(data);
        let data_arr = data.data;
        let html = '';
        for(let i=0; i<data_arr.length; i++){
          html += '<tr><td scope="col">选择</td>';
          html += '<td><input type="checkbox" name=""></td>';
          html += '<td>2018A01/A</td><td>王琳</td><td>90</td><td>90</td><td>90</td><td>-2</td><td>90</td><td>90</td><td>90</td><td>90</td><td>80</td><td>已发布</td><td>良</td><td>';
          html += '<button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#specialListEditModal">修改</button></td></tr>';
        }
        $('#spStu_list_tbody').html(html);
      }
    }
  });
}

// 特殊学生成绩修改【需要等查询特殊学生数据对接完成后才能做了】
function updateSpScore(){

}

// 发布特殊学生成绩【需要等查询特殊学生数据对接完成后才能做了】
function releaseSpScore(){

}


// 6、其他函数

// 格林威治时间的转换
Date.prototype.format = function(format){
	var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        }
    if(/(y+)/.test(format))
    format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
    if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
// 获取标准时间格式
function chGMT(gmtDate){
	var mydate = new Date(gmtDate);
	mydate.setHours(mydate.getHours() + 8);
	// return mydate.format("yyyy-MM-dd hh:mm:ss");
  return mydate.format("yyyy-MM-dd hh:mm");
}
// 获取小时
function getGMThour(gmtDate){
  var mydate = new Date(gmtDate);
	mydate.setHours(mydate.getHours() + 8);
	// return mydate.format("yyyy-MM-dd hh:mm:ss");
  return Number(mydate.format("hh"));
}