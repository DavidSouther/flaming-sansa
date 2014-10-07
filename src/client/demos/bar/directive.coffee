angular.module('graphing.demos.bar', [
    'graphing.svg'
    'graphing.charts.bar'
    'demos.bar.template'
])
.config ($stateProvider)->
    $stateProvider.state 'demo.bar',
        url: '/bar'
        views:
            'demo-bar':
                template: '<bar-demo />'

.directive 'barDemo', ->
    restrict: 'E'
    templateUrl: 'demos/bar'
    controller: ($scope, ChartData)->
        $scope.demoData = ChartData.map (activity)->
            activity.timestamp = Date.parse(activity.timestamp)
            activity

.value 'ChartData', [
	{
		"timestamp": "2014-10-07T12:21:39.156Z",
		"ip": "12.34.222.24",
		"rtt": 168.08160845641805
	},
	{
		"timestamp": "2014-10-07T12:21:40.233Z",
		"ip": "12.34.222.80",
		"rtt": 182.67290809530695
	},
	{
		"timestamp": "2014-10-07T12:21:41.604Z",
		"ip": "12.34.222.196",
		"rtt": 90.39461855716031
	},
	{
		"timestamp": "2014-10-07T12:21:44.215Z",
		"ip": "12.34.222.183",
		"rtt": 196.83835953615997
	},
	{
		"timestamp": "2014-10-07T12:21:47.099Z",
		"ip": "12.34.222.210",
		"rtt": 185.73609346015866
	},
	{
		"timestamp": "2014-10-07T12:21:50.006Z",
		"ip": "12.34.222.45",
		"rtt": 136.22120089509895
	},
	{
		"timestamp": "2014-10-07T12:21:52.745Z",
		"ip": "12.34.222.202",
		"rtt": 127.713853331557
	},
	{
		"timestamp": "2014-10-07T12:21:54.617Z",
		"ip": "12.34.222.104",
		"rtt": 196.45782668000285
	},
	{
		"timestamp": "2014-10-07T12:21:56.903Z",
		"ip": "12.34.222.121",
		"rtt": 169.3510848600195
	},
	{
		"timestamp": "2014-10-07T12:21:59.894Z",
		"ip": "12.34.222.65",
		"rtt": 192.26293245514398
	},
	{
		"timestamp": "2014-10-07T12:22:02.795Z",
		"ip": "12.34.222.48",
		"rtt": 137.19813341560965
	},
	{
		"timestamp": "2014-10-07T12:22:05.165Z",
		"ip": "12.34.222.95",
		"rtt": 176.43940796556373
	},
	{
		"timestamp": "2014-10-07T12:22:08.163Z",
		"ip": "12.34.222.200",
		"rtt": 54.2772852229231
	},
	{
		"timestamp": "2014-10-07T12:22:11.150Z",
		"ip": "12.34.222.103",
		"rtt": 172.52015491044085
	},
	{
		"timestamp": "2014-10-07T12:22:14.123Z",
		"ip": "12.34.222.104",
		"rtt": 188.96025383757743
	},
	{
		"timestamp": "2014-10-07T12:22:16.384Z",
		"ip": "12.34.222.186",
		"rtt": 160.31279474381805
	},
	{
		"timestamp": "2014-10-07T12:22:19.255Z",
		"ip": "12.34.222.77",
		"rtt": 198.44986714991137
	},
	{
		"timestamp": "2014-10-07T12:22:21.369Z",
		"ip": "12.34.222.139",
		"rtt": 145.30029339294018
	},
	{
		"timestamp": "2014-10-07T12:22:21.625Z",
		"ip": "12.34.222.66",
		"rtt": 124.38252212018374
	},
	{
		"timestamp": "2014-10-07T12:22:24.617Z",
		"ip": "12.34.222.145",
		"rtt": 198.66957575832197
	},
	{
		"timestamp": "2014-10-07T12:22:27.481Z",
		"ip": "12.34.222.193",
		"rtt": 190.3397347987629
	},
	{
		"timestamp": "2014-10-07T12:22:29.813Z",
		"ip": "12.34.222.133",
		"rtt": 192.58725408500638
	},
	{
		"timestamp": "2014-10-07T12:22:32.328Z",
		"ip": "12.34.222.202",
		"rtt": 194.01061680203696
	},
	{
		"timestamp": "2014-10-07T12:22:34.537Z",
		"ip": "12.34.222.236",
		"rtt": 172.81765827096362
	},
	{
		"timestamp": "2014-10-07T12:22:37.295Z",
		"ip": "12.34.222.130",
		"rtt": 174.7213335262897
	},
	{
		"timestamp": "2014-10-07T12:22:40.041Z",
		"ip": "12.34.222.237",
		"rtt": 190.46782695647124
	},
	{
		"timestamp": "2014-10-07T12:22:42.592Z",
		"ip": "12.34.222.110",
		"rtt": 198.96502036365038
	},
	{
		"timestamp": "2014-10-07T12:22:45.421Z",
		"ip": "12.34.222.150",
		"rtt": 199.8107335759425
	},
	{
		"timestamp": "2014-10-07T12:22:47.395Z",
		"ip": "12.34.222.123",
		"rtt": 198.68002449378008
	},
	{
		"timestamp": "2014-10-07T12:22:49.999Z",
		"ip": "12.34.222.156",
		"rtt": 199.98966969626002
	},
	{
		"timestamp": "2014-10-07T12:22:51.791Z",
		"ip": "12.34.222.62",
		"rtt": 175.3739035975376
	},
	{
		"timestamp": "2014-10-07T12:22:54.785Z",
		"ip": "12.34.222.17",
		"rtt": 199.62480727564326
	},
	{
		"timestamp": "2014-10-07T12:22:57.402Z",
		"ip": "12.34.222.68",
		"rtt": 182.54399104039305
	},
	{
		"timestamp": "2014-10-07T12:22:59.997Z",
		"ip": "12.34.222.69",
		"rtt": 189.0918499842584
	},
	{
		"timestamp": "2014-10-07T12:23:02.812Z",
		"ip": "12.34.222.44",
		"rtt": 160.55392995522607
	},
	{
		"timestamp": "2014-10-07T12:23:05.239Z",
		"ip": "12.34.222.69",
		"rtt": 189.98334413487444
	},
	{
		"timestamp": "2014-10-07T12:23:07.371Z",
		"ip": "12.34.222.118",
		"rtt": 196.07290456011705
	},
	{
		"timestamp": "2014-10-07T12:23:10.307Z",
		"ip": "12.34.222.125",
		"rtt": 188.1014765717045
	},
	{
		"timestamp": "2014-10-07T12:23:12.992Z",
		"ip": "12.34.222.19",
		"rtt": 196.63671783512098
	},
	{
		"timestamp": "2014-10-07T12:23:15.206Z",
		"ip": "12.34.222.221",
		"rtt": 187.58746681635557
	},
	{
		"timestamp": "2014-10-07T12:23:17.546Z",
		"ip": "12.34.222.171",
		"rtt": 112.6714822941861
	},
	{
		"timestamp": "2014-10-07T12:23:20.154Z",
		"ip": "12.34.222.148",
		"rtt": 196.12136260321824
	},
	{
		"timestamp": "2014-10-07T12:23:22.277Z",
		"ip": "12.34.222.49",
		"rtt": 187.4246988357871
	},
	{
		"timestamp": "2014-10-07T12:23:24.413Z",
		"ip": "12.34.222.236",
		"rtt": 181.19368646574137
	},
	{
		"timestamp": "2014-10-07T12:23:26.377Z",
		"ip": "12.34.222.167",
		"rtt": 198.41559693547117
	},
	{
		"timestamp": "2014-10-07T12:23:29.337Z",
		"ip": "12.34.222.153",
		"rtt": 181.73043817764778
	},
	{
		"timestamp": "2014-10-07T12:23:31.876Z",
		"ip": "12.34.222.16",
		"rtt": 188.79585835996502
	},
	{
		"timestamp": "2014-10-07T12:23:34.856Z",
		"ip": "12.34.222.48",
		"rtt": 192.79632528781204
	},
	{
		"timestamp": "2014-10-07T12:23:37.793Z",
		"ip": "12.34.222.210",
		"rtt": 193.45238013848692
	},
	{
		"timestamp": "2014-10-07T12:23:40.743Z",
		"ip": "12.34.222.232",
		"rtt": 143.91544645844087
	},
	{
		"timestamp": "2014-10-07T12:23:43.633Z",
		"ip": "12.34.222.243",
		"rtt": 170.72592524363057
	},
	{
		"timestamp": "2014-10-07T12:23:46.510Z",
		"ip": "12.34.222.175",
		"rtt": 195.639246196663
	},
	{
		"timestamp": "2014-10-07T12:23:49.482Z",
		"ip": "12.34.222.235",
		"rtt": 176.0325000611148
	},
	{
		"timestamp": "2014-10-07T12:23:52.356Z",
		"ip": "12.34.222.43",
		"rtt": 194.23462842081463
	},
	{
		"timestamp": "2014-10-07T12:23:55.328Z",
		"ip": "12.34.222.102",
		"rtt": 194.0951997907922
	},
	{
		"timestamp": "2014-10-07T12:23:56.541Z",
		"ip": "12.34.222.3",
		"rtt": 192.45070670667914
	},
	{
		"timestamp": "2014-10-07T12:23:59.109Z",
		"ip": "12.34.222.239",
		"rtt": 188.3944087836643
	},
	{
		"timestamp": "2014-10-07T12:24:02.059Z",
		"ip": "12.34.222.98",
		"rtt": 191.36307832639517
	},
	{
		"timestamp": "2014-10-07T12:24:04.412Z",
		"ip": "12.34.222.234",
		"rtt": 85.62785129379532
	},
	{
		"timestamp": "2014-10-07T12:24:07.290Z",
		"ip": "12.34.222.64",
		"rtt": 196.09847875360725
	},
	{
		"timestamp": "2014-10-07T12:24:10.247Z",
		"ip": "12.34.222.202",
		"rtt": 199.2172917277107
	},
	{
		"timestamp": "2014-10-07T12:24:12.624Z",
		"ip": "12.34.222.68",
		"rtt": 186.52607354607076
	},
	{
		"timestamp": "2014-10-07T12:24:14.414Z",
		"ip": "12.34.222.128",
		"rtt": 179.58414968503666
	},
	{
		"timestamp": "2014-10-07T12:24:17.381Z",
		"ip": "12.34.222.195",
		"rtt": 198.22636559428543
	},
	{
		"timestamp": "2014-10-07T12:24:19.377Z",
		"ip": "12.34.222.223",
		"rtt": 116.46987605364527
	},
	{
		"timestamp": "2014-10-07T12:24:22.256Z",
		"ip": "12.34.222.162",
		"rtt": 192.99315157565573
	},
	{
		"timestamp": "2014-10-07T12:24:24.499Z",
		"ip": "12.34.222.30",
		"rtt": 199.83366743501648
	},
	{
		"timestamp": "2014-10-07T12:24:26.676Z",
		"ip": "12.34.222.129",
		"rtt": 128.43489961883859
	},
	{
		"timestamp": "2014-10-07T12:24:29.666Z",
		"ip": "12.34.222.195",
		"rtt": 199.3477162597989
	},
	{
		"timestamp": "2014-10-07T12:24:32.275Z",
		"ip": "12.34.222.5",
		"rtt": 194.19350957998677
	},
	{
		"timestamp": "2014-10-07T12:24:35.269Z",
		"ip": "12.34.222.232",
		"rtt": 193.22077703573197
	},
	{
		"timestamp": "2014-10-07T12:24:37.810Z",
		"ip": "12.34.222.142",
		"rtt": 199.99227108843544
	},
	{
		"timestamp": "2014-10-07T12:24:40.810Z",
		"ip": "12.34.222.87",
		"rtt": 175.75343225410802
	},
	{
		"timestamp": "2014-10-07T12:24:43.465Z",
		"ip": "12.34.222.121",
		"rtt": 197.90272345834956
	},
	{
		"timestamp": "2014-10-07T12:24:46.078Z",
		"ip": "12.34.222.135",
		"rtt": 167.24729219343976
	},
	{
		"timestamp": "2014-10-07T12:24:48.472Z",
		"ip": "12.34.222.48",
		"rtt": 153.3313019394164
	},
	{
		"timestamp": "2014-10-07T12:24:51.378Z",
		"ip": "12.34.222.93",
		"rtt": 199.9945908861114
	},
	{
		"timestamp": "2014-10-07T12:24:53.825Z",
		"ip": "12.34.222.65",
		"rtt": 142.68204210614115
	},
	{
		"timestamp": "2014-10-07T12:24:56.735Z",
		"ip": "12.34.222.147",
		"rtt": 199.716363088137
	},
	{
		"timestamp": "2014-10-07T12:24:59.198Z",
		"ip": "12.34.222.51",
		"rtt": 186.30883414098417
	},
	{
		"timestamp": "2014-10-07T12:25:02.198Z",
		"ip": "12.34.222.143",
		"rtt": 108.81980888815741
	},
	{
		"timestamp": "2014-10-07T12:25:04.364Z",
		"ip": "12.34.222.28",
		"rtt": 197.9969325156788
	},
	{
		"timestamp": "2014-10-07T12:25:06.866Z",
		"ip": "12.34.222.110",
		"rtt": 190.8143130221
	},
	{
		"timestamp": "2014-10-07T12:25:09.700Z",
		"ip": "12.34.222.101",
		"rtt": 197.10897819030092
	},
	{
		"timestamp": "2014-10-07T12:25:12.423Z",
		"ip": "12.34.222.86",
		"rtt": 198.19821900393384
	},
	{
		"timestamp": "2014-10-07T12:25:14.634Z",
		"ip": "12.34.222.172",
		"rtt": 199.37934664520802
	},
	{
		"timestamp": "2014-10-07T12:25:17.557Z",
		"ip": "12.34.222.200",
		"rtt": 162.60238332819748
	},
	{
		"timestamp": "2014-10-07T12:25:20.560Z",
		"ip": "12.34.222.143",
		"rtt": 199.41398388739478
	},
	{
		"timestamp": "2014-10-07T12:25:23.498Z",
		"ip": "12.34.222.224",
		"rtt": 199.3374226563996
	},
	{
		"timestamp": "2014-10-07T12:25:26.498Z",
		"ip": "12.34.222.130",
		"rtt": 188.16966125632857
	},
	{
		"timestamp": "2014-10-07T12:25:29.382Z",
		"ip": "12.34.222.133",
		"rtt": 193.4168271917877
	},
	{
		"timestamp": "2014-10-07T12:25:32.363Z",
		"ip": "12.34.222.209",
		"rtt": 183.01776449930148
	},
	{
		"timestamp": "2014-10-07T12:25:35.239Z",
		"ip": "12.34.222.95",
		"rtt": 164.72794964851568
	}
]
