export default app => {
  app.service('ApiService', ['$http', $http => {
    return dir => $http.get('./api/' + dir)
  }]);
  app.factory('CtrlInit', [() => {
    let _cb
    return (cb, vm) => {
      if (cb && vm) {
        vm.modelSelect = {}
      }
      _cb = cb ? cb : _cb;
      (cb || _cb)()
    }
  }])
  app.factory('CtrlRefresh', ['CtrlInit', CtrlInit => {
    return () => {
      CtrlInit()
    }
  }])
  app.factory('CtrlTablePage', ['CtrlRefresh', CtrlRefresh => {
    return () => {
      let page = {
        pageNumber: 1,
        pageSize: 10,
        pageTotal: 0,
        changePage: function (pageNumber) {
          this.pageNumber = pageNumber
          CtrlRefresh()
        }
      }
      return page
    }
  }])
  app.factory('IpTest', () => (ip, vm, success) => {
    if (!ip) {
      vm.errorTxt = '输入ip不合法!'
      return
    }
    let r = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)
    if (r) {
      vm.errorTxt = ''
      success()
    } else
      vm.errorTxt = '输入ip不合法!'
  })

  let loadNum = 0
  app.factory('Loading', () => (status, url) => {
    let onloadingDiv = document.getElementById('onloadingDiv')
    if (!onloadingDiv) return

    if (status) {
      if (url.match('isReposNameRepeat')) return

      loadNum++
      onloadingDiv.classList.remove('hidden')
    } else {
      loadNum--
      if (loadNum <= 0) {
        loadNum = 0
        onloadingDiv.classList.add('hidden')
      }
    }
  })
}