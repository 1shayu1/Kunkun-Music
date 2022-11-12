<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style>
	/*每个页面公共css */
	.container{
		width: 100%;
		/* vh:即viewpoint height, 视窗高度，1vh = 1%的视窗高度 */
		height: calc(100vh - 75px);
		overflow: hidden;
	}
	.container scroll-view{
		height:100%;
	}
	
	/* 列表页背景 */
	.fixbg{
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-image: url(./static/iconfont/ji.png);
		/* 覆盖整个可视区 */
		background-size: cover;
		background-position: center 0;
		/* 背景模糊 */
		filter: blur(10px);
		transform: scale(1.2);
	}
</style>
