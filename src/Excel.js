import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';
import * as XLSX from 'xlsx';
//import styles from './index.less';
/**
 * 使用xlsx來讀取excel,並優改指定欄位值
 * 重新產生的檔案外觀會跑掉,改用server端的
 */
class Excel extends Component {
  onImportExcel = file => {
    // 获取上传的文件对象
    const { files } = file.target;
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' ,cellStyles:true});
         // 存储获取到的数据
        let data = [];
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          // esline-disable-next-line
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            
            // break; // 如果只取第一张表，就取消注释这行
            let xx = workbook.Sheets[sheet];
            xx.A4={};
            xx.A4.v = 'testGOGOGO';
            xx.A4.t = 's';
            xx.A4.s = { font: { sz: 20, bold: true, color: { rgb: "FFFFAA00" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
            console.log(xx);
            data = data.concat(XLSX.utils.sheet_to_json(xx));
            
            workbook.Sheets[sheet]  = xx;
            
          }
        }
        // 最终获取到并且格式化后的 json 数据
        message.success('上传成功！')
        console.log(data);
        XLSX.writeFile(workbook, "issue1124.xlsx",{cellStyles:true});
        
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确！');
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  }
  render() {
    return (
      <div style={{ marginTop: 100 }}>
        <Button >
          
          <input  type='file' accept='.xlsx, .xls' onChange={this.onImportExcel} />
          <span >上传文件</span>
        </Button>
        <Button onClick={this.onImportExcel} >
          下載
        </Button>
        <p >支持 .xlsx、.xls 格式的文件</p>
      </div >
    );
  }
}

export default Excel;