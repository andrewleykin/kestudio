(function(){

  const initVue = () => {
    const calculator = new Vue({
      el: '#calculator',
      data: {
        isOpenSericesList: false
      },
      methods: {
        toggleServicesList() {
          this.isOpenSericesList = !this.isOpenSericesList
        }
      }
    })
  }

  if ($('#calculator').length) {
		$(function(){
			// initVue()
		});
	}
})()