export default app => {
    app.filter('version_status', function () {
        return function (status) {
            if (status == '1') {
                return "开发中";
            }
            if (status == '2') {
                return "已封版";
            }
            if (status == '3') {
                return "已发布";
            }
            if (status == '4') {
                return "已归档";
            }
            return "已删除";
        }
    })
};