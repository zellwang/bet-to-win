/**
 * 整页的动画效果
 */
function pageAnimated() {
    $("#page").addClass("animated fadeIn")
}

/**
 * logo的动画效果（某些页面需要）
 */
function logoAnimated() {
    $("#logo").addClass("animated flipInX")
}

/**
 * 加载API过程中使用的loading
 */
function showLoading() {
    $(".loading-wrap").addClass("show");
}

function hideLoading() {
    $(".loading-wrap").removeClass("show");
}

/**
 * 返回上一页
 */
function goBack() {
    window.history.back();   
}