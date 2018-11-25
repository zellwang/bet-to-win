1. reference：引用的第三方库
2. guessing：源代码
3. css/guessing.css：页面样式
4. js/guessing.js： 每个页面一个入口的js。例如index.html是indexController
   js/common.js：公共的js。例如：动画效果
5. 页面入口：index.html页面，等待5s，弹出是否登录的对话框。
   点击“确定”，表示已登录，跳转到首页home.html
   点击“取消”，表示未登录，跳转到登录页面login.html