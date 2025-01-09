if(window.location.hostname != 'busline.design') {
    window.location = 'https://busline.design/?settings=' + btoa(String.fromCharCode(...pako.deflate(localStorage.getItem('settings') ?? '{}')));
}

const bld = Vue.createApp({
    setup() {
        const blankLineFile = {
            "fileVersion": 1,
            "cityName": "",
            "lineName": "",
            "lineColor": "#00D3FC",
            "remark": "",
            "lineType": 1,
            "company": "",
            "route": {
                "up": [],
                "down": []
            },
            "serviceTime": {
                "up": "",
                "down": ""
            },
            "fare": {
                "strategy": "multilevel",
                "enableRing": "0",
                "desc": "",
                "single": {
                    "price": "1.00"
                },
                "multilevel": {
                    "startPrice": "0.00",
                    "startingDistance": "0.00",
                    "magnification": "0.20",
                    "magnificationAttenuation": "0.00",
                    "increaseBase": "1.00",
                    "maxPrice": "Infinity",
                },
                "text": {
                    "text": ""
                },
                "customize": {
                    "formula": "0.2*distance"
                }
            }
        };
        return{
            blankLineFile,
        }
    },
    data() {
        return {
            currentTab: 'stations',
            tabs: [
                {id: 'stations', name: '设站'},
                {id: 'fare', name: '票价'},
                {id: 'schematic', name: '图示'},
                {id: 'settings', name: '设置'},
                {id: 'about', name: '关于'}
            ],
            settings: {
                general: {
                    mainDirection: {
                        name: '正方向',
                        current: '0',
                        default: '0',
                        type: 'select',
                        options: [
                            {name: '上行', value: '0'},
                            {name: '下行', value: '1'},
                        ]
                    },
                    enableUndoFunc: {
                        name: '撤销功能',
                        current: '1',
                        default: '1',
                        type: 'select',
                        options: [
                            {name: '禁用', value: '0'},
                            {name: '启用', value: '1'},
                        ]
                    },
                    customizeKey: {
                        name: '自定义 Key+安全密钥',
                        current: '',
                        default: '',
                        type: 'input',
                        placeholder: '留空则使用默认 Key',
                        description: '使用空格分隔，刷新页面后生效',
                    },
                },
                map: {
                    showStationName: {
                        name: '在地图上显示站名',
                        current: '1',
                        default: '1',
                        type: 'select',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '智能显示 (防碰撞)', value: '1'},
                            {name: '全部显示', value: '0.5'},
                        ]
                    },
                    showOpposite: {
                        name: '显示线路反向',
                        current: '0.4',
                        default: '0.4',
                        type: 'select',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '半透明显示', value: '0.4'},
                            {name: '不透明显示', value: '1'},
                        ]
                    },
                    mapStyle: {
                        name: '地图风格',
                        current: 'amap://styles/normal',
                        default: 'amap://styles/normal',
                        type: 'select',
                        options: [
                            {name: '默认', value: 'amap://styles/normal'},
                            {name: '马卡龙', value: 'amap://styles/macaron'},
                            {name: '草色青', value: 'amap://styles/fresh'},
                            {name: '远山黛', value: 'amap://styles/whitesmoke'},
                            {name: '月光银', value: 'amap://styles/light'},
                            {name: '靛青蓝', value: 'amap://styles/blue'},
                            {name: '极夜蓝', value: 'amap://styles/darkblue'},
                            {name: '雅土灰', value: 'amap://styles/grey'},
                            {name: '幻影黑', value: 'amap://styles/dark'},
                        ]
                    },
                    lineStrokeWidth: {
                        name: '线路宽度',
                        current: '6',
                        default: '6',
                        type: 'select',
                        options: [
                            {name: '细', value: '2'},
                            {name: '较细', value: '4'},
                            {name: '默认', value: '6'},
                            {name: '较粗', value: '8'},
                            {name: '粗', value: '10'},
                        ]
                    },
                    stationLightness: {
                        name: '站点颜色明度',
                        current: '-64',
                        default: '-64',
                        type: 'select',
                        options: [
                            {name: '黑', value: '-256'},
                            {name: '暗', value: '-64'},
                            {name: '较暗', value: '-32'},
                            {name: '正常', value: '0'},
                            {name: '较亮', value: '32'},
                            {name: '亮', value: '64'},
                            {name: '原版', value: 'origin'},
                        ]
                    },
                    stationStrokeWidth: {
                        name: '站点描边宽度',
                        current: '2',
                        default: '2',
                        type: 'select',
                        options: [
                            {name: '细', value: '1'},
                            {name: '默认', value: '2'},
                            {name: '较粗', value: '3'},
                            {name: '粗', value: '4'},
                        ]
                    },
                    stationFillRadius: {
                        name: '站点大小',
                        current: '5',
                        default: '5',
                        type: 'select',
                        options: [
                            {name: '小', value: '3'},
                            {name: '较小', value: '4'},
                            {name: '默认', value: '5'},
                            {name: '较大', value: '6'},
                            {name: '大', value: '7'},
                        ]
                    },
                },
                fare: {
                    fix: {
                        name: '票价精度',
                        current: '2',
                        default: '2',
                        type: 'select',
                        options: [
                            {name: '整数', value: '0'},
                            {name: '小数点后一位', value: '1'},
                            {name: '小数点后两位', value: '2'},
                        ]
                    },
                    imageQuality: {
                        name: "图片保存质量",
                        current: '{"type":"image/png", "quality": 1.0}',
                        default: '{"type":"image/png", "quality": 1.0}',
                        type: 'select',
                        options: [
                            {name: "PNG 无损", value: '{"type":"image/png", "quality": 1.0}'},
                            {name: "JPG 100%", value: '{"type":"image/jpeg", "quality": 1.0}'},
                            {name: "JPG 90%", value: '{"type":"image/jpeg", "quality": 0.9}'},
                            {name: "JPG 80%", value: '{"type":"image/jpeg", "quality": 0.8}'},
                            {name: "JPG 50%", value: '{"type":"image/jpeg", "quality": 0.5}'},
                            {name: "JPG 25%", value: '{"type":"image/jpeg", "quality": 0.25}'},
                        ]
                    },
                    enableCellColor: {
                        name: '多级票价单元格颜色',
                        current: '1',
                        default: '1',
                        type: 'select',
                        options: [
                            {name: '黑白', value: '0'},
                            {name: '彩色', value: '1'},
                        ]
                    },
                    showStationAhead: {
                        name: '在表格左侧显示站名',
                        current: '0',
                        default: '0',
                        type: 'select',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '显示', value: '1'},
                        ]
                    },
                    showStationBehind: {
                        name: '在表格右侧显示站名',
                        current: '1',
                        default: '1',
                        type: 'select',
                        options: [
                            {name: '不显示', value: '0'},
                            {name: '显示', value: '1'},
                        ]
                    },
                },
                lineMap: {
                    showLinesByDefault: {
                        name: '默认展示线路',
                        current: '1',
                        default: '1',
                        type: 'select',
                        options: [
                            {name: '展示', value: '1'},
                            {name: '不展示', value: '0'},
                        ]
                    },
                    showStationsByDefault: {
                        name: '默认展示站点',
                        current: '1',
                        default: '1',
                        type: 'select',
                        options: [
                            {name: '展示', value: '1'},
                            {name: '不展示', value: '0'},
                        ]
                    },
                },
            },
            announcement: {
                lastUpdated: Date.parse('2022/12/16 21:30:00'),
                content: 'Bus Line Designer 自动算路 / 站点自动命名 失效了？解决办法详见：https://mp.weixin.qq.com/s/wAgdE5AkqfMvSTfV3tKjTg'
            },
            lineFile: deepClone(this.blankLineFile),
            originalLineFile: deepClone(this.blankLineFile),
            undoable: false,
            fileInput: VueReactivity.shallowRef(null),
            fileReader: VueReactivity.shallowRef(null),
            clipboard: new ClipboardJS('#copyLine'),
            modalConfirm: {
                title: '',
                content: ''
            },
            modalLineSearch: {
                dataSource: 'AMap',
                lineName: '',
                city: '',
                chelaile: {
                    province: '',
                    city: '',
                },
                chinaRailway: {
                    trainCode: '',
                    date: new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0'),
                },
                advanced: null,
                CitiesLoadingPrompt: '正在加载列表…'
            },
            modalLineSearchAdvanced: {
                data: []
            },
            toast: {
                title: '',
                subtitle: '',
                content: '',
                autohide: true
            },
            regions: {},
            chelaileTempData: {},
            crTempData: {},
        }
    },
    mounted() {
        if(new Date().getDay() == 4){
            for(var i = 0; i < 50; i++){
                console.warn('KaiFengCai crazy thursday V me 50');
            }
        }

        window.onbeforeunload = function(e) {
            var e = window.event || e;
            e.returnValue = ("确定离开页面吗？现有线路内容将丢失。请确保已保存当前线路。");
        };

        this.clipboard.on('success', this.copyLine);
        this.clipboard.on('error', this.copyLineFailed);
        this.fileInput = document.createElement('input');
        this.fileInput.setAttribute('type', 'file');
        this.fileInput.addEventListener('change', this.readFile);
        this.fileReader = new FileReader();
        this.fileReader.addEventListener('load', this.loadLineFromFile);

        var savedSettings;
        const params = new URLSearchParams(window.location.search);
        if(savedSettings = params.get('settings')){
            savedSettings = JSON.parse(new TextDecoder().decode(pako.inflate(Uint8Array.from(atob(savedSettings.replaceAll(' ', '+')), c => c.charCodeAt(0)))));
            for(const type in savedSettings){
                for(const item in savedSettings[type]){
                    this.settings[type][item].current = savedSettings[type][item].current;
                }
            }
            new bootstrap.Modal(document.getElementById('modalNewDomain')).show();
            try{
                history.replaceState(null, '', '/');
            }catch(e){}
        }else if(savedSettings = localStorage.getItem('settings')){
            savedSettings = JSON.parse(savedSettings);
            for(const type in savedSettings){
                for(const item in savedSettings[type]){
                    this.settings[type][item].current = savedSettings[type][item].current;
                }
            }
        }else{
            localStorage.setItem('settings', JSON.stringify(this.settings));
        }

        var announcementLastRead = localStorage.getItem('announcementLastRead') ? localStorage.getItem('announcementLastRead') : 0;
        if(announcementLastRead < this.announcement.lastUpdated){
            this.showMessage(["公告", "", this.announcement.content, false]);
            localStorage.setItem('announcementLastRead', Date.now());
        }

        if (this.settings.general.customizeKey.current) {
            let config = this.settings.general.customizeKey.current.split(' ');
            window.AMapKey = config[0];
            window._AMapSecurityConfig = {
                securityJsCode: config[1],
            };

            this.showMessage(["正在使用自定义 Key", "", "如果加载地图出现问题，请检查设置中的自定义 Key 选项", false]);
        } else {
            this.showMessage(["未设置自定义 Key", "", "大部分功能将不可用。详见 https://mp.weixin.qq.com/s/wAgdE5AkqfMvSTfV3tKjTg", false]);
        }

        this.$refs.tabStation.mapInit();
        getContents("https://api.chelaile.net.cn/goocity/city!morecities.action?sign=&s=android&v=&vc=245", this.loadRegions);
    },
    methods: {
        setTab(tabId) {
            this.currentTab = tabId;
            this.loadLine();
        },
        toggleTab(tabId) {
            this.setTab(tabId.tab);
        },

        saveOriginal(){
            if(this.settings.general.enableUndoFunc.current == "1"){
                this.originalLineFile = deepClone(this.lineFile);
                this.undoable = true;
            }
        },
        undo(){
            if(this.undoable){
                this.lineFile = deepClone(this.originalLineFile);
                this.undoable = false;
                this.$refs.tabStation.undo();
            }else{
                this.showMessage(["撤销失败", "", "没有可以撤销的内容了…"]);
            }
        },

        loadLineFromReality(){
            this.showModalConfirm("读取线路", "确定读取线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.showModalLineSearch);
        },
        loadLineFromRealitySearch(advanced = false){
            if(!this.modalLineSearch.lineName && this.modalLineSearch.dataSource != "ChinaRailway"){
                this.showMessage(["读取线路", "", "读取线路失败: 未填写线路名称"]);
                return;
            }
            this.showMessage(["读取线路", "", "正在加载线路…"]);
            if(this.modalLineSearch.dataSource == "AMap"){
                var lineSearch = new AMap.LineSearch({
                    pageIndex: 1,
                    pageSize: advanced?12:1,
                    city: this.modalLineSearch.city || "全国",
                    extensions: "all"
                });
                lineSearch.search(this.modalLineSearch.lineName, advanced?this.getLineFromAmapAdvanced:this.getLineFromAmapUp);
            }else if(this.modalLineSearch.dataSource == "chelaile"){
                if(!this.modalLineSearch.chelaile.city.id){
                    this.showMessage(["读取线路", "", "读取线路失败: 没有选择城市", false]);
                }else{
                    this.modalLineSearch.advanced = advanced;
                    getContents("https://cdn.api.chelaile.net.cn/bus/query!nSearch.action?sign=&s=&v=&vc=245&cityId=" + this.modalLineSearch.chelaile.city.id + "&key=" + encodeURIComponent(this.modalLineSearch.lineName), this.getLineFromChelaile);
                }
            }else if(this.modalLineSearch.dataSource == "ChinaRailway"){
                getContents("https://mobile.12306.cn/wxxcx/alipay/main/travelServiceQrcodeTrainInfo", this.getLineStationsFromChinaRailway, "POST", "application/x-www-form-urlencoded", "startDay=" + this.modalLineSearch.chinaRailway.date + "&trainCode=" + this.modalLineSearch.chinaRailway.trainCode);
            }
        },
        getLineFromAmapAdvanced(status, result){
            if(status != "complete"){
                this.showMessage(["读取线路", "", "读取线路失败: " + status, false]);
                return;
            }else if(!result.lineInfo.length){
                this.showMessage(["读取线路", "", "读取线路失败: 没有结果", false]);
                return;
            }

            this.modalLineSearchAdvanced.data = result.lineInfo;
            var m = new bootstrap.Modal(document.getElementById("modalLineSearchAdvanced"));
            m.show();
        },
        getLineFromAmapAdvancedSelect(selected){
            this.getLineFromAmapUp("complete", {lineInfo: [this.modalLineSearchAdvanced.data[selected]]});
        },
        getLineFromAmapUp(status, result){
            if(status != "complete"){
                this.showMessage(["读取线路", "", "读取线路失败: " + status, false]);
                return;
            }else{
                this.lineFile = deepClone(this.blankLineFile);
                var line = result.lineInfo[0];
                var districtSearch = new AMap.DistrictSearch({
                    level: 'city',
                    subdistrict: 0
                })
                districtSearch.search(line.citycode, this.getLineFromAmapCitySearch);

                this.lineFile.lineName = line.name.replace(/\(.*\)$/, '').replace("内环", "").replace("外环", "").replace("内圈", "").replace("外圈", "");
                this.lineFile.company = line.company;

                if(!line.basic_price || !line.total_price){
                    this.lineFile.fare.strategy = 'text';
                    this.lineFile.fare.text.text = '未知';
                }else if(line.basic_price == line.total_price){
                    this.lineFile.fare.strategy = 'single';
                    this.lineFile.fare.single.price = line.basic_price;
                }else{
                    this.lineFile.fare.strategy = 'text';
                    this.lineFile.fare.text.text = '多级票价 ' + line.basic_price + '~' + line.total_price + '元';
                }
                if(line.stime.length && line.etime.length){
                    this.lineFile.serviceTime.up = line.stime.slice(0, 2) + ':' + line.stime.slice(2) + '~' + line.etime.slice(0, 2) + ':' + line.etime.slice(2);
                }else if(line.timedesc){
                    var time = JSON.parse(decodeURIComponent(line.timedesc));
                    this.lineFile.serviceTime.up = time.allRemark;
                }else{
                    this.lineFile.serviceTime.up = '未知';
                }
                var isBilateral = (line.direc != line.id);
                this.lineFile.lineType = line.loop * 2 + !isBilateral * 1 + 1;
                if(line.uicolor){
                    this.lineFile.lineColor = '#' + line.uicolor;
                }
                this.setStationsFromAmap('up', line.path, line.via_stops);
                if(isBilateral){
                    var lineSearch = new AMap.LineSearch({
                        pageIndex: 1,
                        pageSize: 1,
                        city: city,
                        extensions: "all"
                    });
                    lineSearch.searchById(line.direc, this.getLineFromAmapDown);
                }else{
                    this.loadLine();
                    this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
                }
                return;
            }
        },
        getLineFromAmapDown(status, result){
            if(status != "complete"){
                this.loadLine();
                this.showMessage(["读取线路", "", "读取线路下行失败: " + status, false]);
                return;
            }else{
                var line = result.lineInfo[0];
                if(line.stime.length && line.etime.length){
                    this.lineFile.serviceTime.down = line.stime.slice(0, 2) + ':' + line.stime.slice(2) + '~' + line.etime.slice(0, 2) + ':' + line.etime.slice(2);
                }else if(line.timedesc){
                    var time = JSON.parse(decodeURIComponent(line.timedesc));
                    this.lineFile.serviceTime.down = time.allRemark;
                }else{
                    this.lineFile.serviceTime.down = '未知';
                }
                this.setStationsFromAmap('down', line.path, line.via_stops);
                this.loadLine();
                this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
                return;
            }
        },
        getLineFromAmapCitySearch(status, result){
            if(status == "complete"){
                this.lineFile.cityName = result.districtList[0].name;
                this.loadLine();
            }
        },
        setStationsFromAmap(direction, path, stations){
            var route = this.lineFile.route[direction];
            var stationCount = 0;
            path.forEach((node, index) => {
                var newNode;
                if(stations[stationCount].location.getLng() == node.getLng() && stations[stationCount].location.getLat() == node.getLat()){
                    newNode = {
                        'type': 'station',
                        'name': stations[stationCount].name,
                        'lng': stations[stationCount].location.getLng(),
                        'lat': stations[stationCount].location.getLat()
                    };
                    stationCount ++;
                }else{
                    newNode = {
                        'type': 'waypoint',
                        'name': '途经点 #' + Math.abs(CRC32C.str('(' + node.getLng() + ',' + node.getLat() + ')')).toString(16).toUpperCase(),
                        'lng': node.getLng(),
                        'lat': node.getLat()
                    };
                }
                route.splice(index, 0, newNode);
            });
        },
        getLineFromChelaile(searchResult){
            searchResult = searchResult.match(/^\*\*YGKJ(.*)YGKJ##$/)[1];
            try{
                searchResult = JSON.parse(searchResult).jsonr;
            }catch(e){this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);}
            if(searchResult.status != "00"){
                this.showMessage(["读取线路", "", "读取线路失败: " + searchResult.status, false]);
                return;
            }else if(!searchResult.data.result.lineCount){
                this.showMessage(["读取线路", "", "读取线路失败: 没有结果", false]);
                return;
            }

            if(this.modalLineSearch.advanced){
                this.modalLineSearchAdvanced.data = searchResult.data.result.lines;
                var m = new bootstrap.Modal(document.getElementById("modalLineSearchAdvanced"));
                m.show();
            }
            else{
                this.getLineFromChelaileIntro(searchResult.data.result.lines[0]);
            }
        },
        getLineFromChelaileAdvancedSelect(index){
            this.getLineFromChelaileIntro(this.modalLineSearchAdvanced.data[index]);
        },
        getLineFromChelaileIntro(lineIntro){
            this.chelaileTempData.lineIdUp = lineIntro.lineId;
            this.chelaileTempData.cityId = this.modalLineSearch.chelaile.city.id;
            this.lineFile = deepClone(this.blankLineFile);
            this.lineFile.lineName = lineIntro.name;
            this.lineFile.cityName = this.modalLineSearch.chelaile.city.name;
            getContents("https://api.chelaile.net.cn/bus/line!lineDetail.action?sign=&s=&v=&lineName=1&cityId=" + this.chelaileTempData.cityId + "&lineId=" + encodeURIComponent(this.chelaileTempData.lineIdUp), this.getLineFromChelaileUpDetails);
        },
        getLineFromChelaileUpDetails(data){
            data = data.match(/^\*\*YGKJ(.*)YGKJ##$/)[1];
            try{
                data = JSON.parse(data).jsonr;
            }catch(e){this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);}
            this.chelaileTempData.stationsUp = data.data.stations;
            this.chelaileTempData.lineIdDown = data.data.otherlines.length ? data.data.otherlines[0].lineId : null;
            var isLoop = (data.data.line.startSn == data.data.line.endSn);
            var isBilateral = (data.data.otherlines.length > 0);
            this.lineFile.lineType = isLoop * 2 + !isBilateral * 1 + 1;
            this.lineFile.serviceTime.up = data.data.line.firstTime + ' ~ ' + data.data.line.lastTime;
            if(!data.data.line.price){
                this.lineFile.fare.strategy = 'text';
                this.lineFile.fare.text.text = '未知';
            }else if(data.data.line.price.search('~') >= 0){
                this.lineFile.fare.strategy = 'text';
                this.lineFile.fare.text.text = '多级票价 ' + data.data.line.price;
            }else{
                this.lineFile.fare.strategy = 'single';
                this.lineFile.fare.single.price = data.data.line.price.replace('元', '');
            }
            getContents(data.data.jxPath, this.getLineFromChelaileUpRoute);
        },
        getLineFromChelaileUpRoute(data){
            data = data.match(/^\*\*YGKJ(.*)YGKJ##$/)[1];
            this.setRouteFromChelaile('up', this.chelaileTempData.stationsUp, JSON.parse(data).jsonr.data);
            if(this.chelaileTempData.lineIdDown){
                getContents("https://api.chelaile.net.cn/bus/line!lineDetail.action?sign=&s=&v=&lineName=1&cityId=" + this.chelaileTempData.cityId + "&lineId=" + encodeURIComponent(this.chelaileTempData.lineIdDown), this.getLineFromChelaileDownDetails);
            }
            else{
                this.loadLine();
                this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
            }
        },
        getLineFromChelaileDownDetails(data){
            data = data.match(/^\*\*YGKJ(.*)YGKJ##$/)[1];
            try{
                data = JSON.parse(data).jsonr;
            }catch(e){this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);}
            this.chelaileTempData.stationsDown = data.data.stations;
            this.lineFile.serviceTime.down = data.data.line.firstTime + ' ~ ' + data.data.line.lastTime;
            getContents(data.data.jxPath, this.getLineFromChelaileDownRoute);
        },
        getLineFromChelaileDownRoute(data){
            data = data.match(/^\*\*YGKJ(.*)YGKJ##$/)[1];
            this.setRouteFromChelaile('down', this.chelaileTempData.stationsDown, JSON.parse(data).jsonr.data);
            this.loadLine();
            this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
        },
        setRouteFromChelaile(direction, stations, route){
            var nodes = route.tra.split(';');
            nodes.forEach(node => {
                var info = node.split(',');
                var newNode;

                var lngLat = wgs84ToGcj02(info[0], info[1]);
                var lng = lngLat[0];
                var lat = lngLat[1];

                if(info.length == 3){
                    var station = stations[parseInt(info[2]) - 1];
                    newNode = {
                        type: 'station',
                        name: station.sn,
                        lng: lng,
                        lat: lat,
                    };
                }else{
                    newNode = {
                        type: 'waypoint',
                        name: '途经点 #' + Math.abs(CRC32C.str('(' + lng + ',' + lat + ')')).toString(16).toUpperCase(),
                        lng: lng,
                        lat: lat
                    };
                }
                this.lineFile.route[direction].push(newNode);
            });

            var lastStation = stations[stations.length - 1];
            var lastStationLngLat = wgs84ToGcj02(lastStation.wgsLng, lastStation.wgsLat);
            this.lineFile.route[direction].push({
                type: 'station',
                name: lastStation.sn,
                lng: lastStationLngLat[0],
                lat: lastStationLngLat[1],
            });
        },
        getLineStationsFromChinaRailway(result){
            result = JSON.parse(result).data.trainDetail;
            if(Object.keys(result).length == 0){
                this.showMessage(["读取线路", "", `读取线路失败：未找到 ${this.modalLineSearch.chinaRailway.date} 车次 ${this.modalLineSearch.chinaRailway.trainCode}`]);
                return;
            }
            let trainCodes = [];
            let timeTable = [];
            let formatTime = (time) => {return time.slice(0, 2) + ':' + time.slice(2)};
            this.lineFile = deepClone(this.blankLineFile);
            this.crTempData.stations = {};
            this.lineFile.lineType = 2;
            this.lineFile.cityName = "中华人民共和国";
            this.lineFile.company = result.stopTime[0].jiaolu_corporation_code;
            this.lineFile.fare.strategy = "text";
            this.lineFile.fare.text.text = "未知";
            for(let station of result.stopTime){
                if(!trainCodes.includes(station.stationTrainCode)){
                    trainCodes.push(station.stationTrainCode);
                }
                this.crTempData.stations[station.stationName] = {
                    type: 'station',
                    name: station.stationName,
                    lng: station.lon,
                    lat: station.lat,
                };
                timeTable.push(`${station.stationName} ${formatTime(station.arriveTime)}到 ${formatTime(station.startTime)}发${station.dayDifference == '0' ? '' : ` (+${station.dayDifference})`}`);
            }
            this.lineFile.lineName = trainCodes.join('/') + '次';
            this.lineFile.serviceTime.up = timeTable.join('\n');
            getContents("https://mobile.12306.cn/wxxcx/alipay/main/getTrainMapLine", this.getLinePathFromChinaRailway, "POST", "application/x-www-form-urlencoded", "startDay=" + this.modalLineSearch.chinaRailway.date + "&trainCode=" + this.modalLineSearch.chinaRailway.trainCode + "&version=v2");
        },
        getLinePathFromChinaRailway(result){
            result = JSON.parse(result).data;
            if(Object.keys(result).length == 0){
                for(let stationName in this.crTempData.stations){
                    let station = this.crTempData.stations[stationName];
                    station.name = station.name.replaceAll(" ", "");
                    this.lineFile.route.up.push(station);
                }
                this.loadLine();
                this.showMessage(["读取线路", "", "车次无具体走向数据，仅获取车站位置"]);
                return;
            }
            for(var section in result){
                if(this.crTempData.stations[section.split('-')[0]]){
                    this.lineFile.route.up.push({
                        type: 'station',
                        name: this.crTempData.stations[section.split('-')[0]].name,
                        lng: parseFloat(this.crTempData.stations[section.split('-')[0]].lng),
                        lat: parseFloat(this.crTempData.stations[section.split('-')[0]].lat),
                    });
                }
                for(let waypoint of result[section].line){
                    this.lineFile.route.up.push({
                        type: 'waypoint',
                        name: '途经点 #' + Math.abs(CRC32C.str('(' + waypoint[0] + ',' + waypoint[1] + ')')).toString(16).toUpperCase(),
                        lng: waypoint[0],
                        lat: waypoint[1],
                    });
                }
            }
            this.lineFile.route.up.push({
                type: 'station',
                name: this.crTempData.stations[section.split('-')[1]].name,
                lng: parseFloat(this.crTempData.stations[section.split('-')[1]].lng),
                lat: parseFloat(this.crTempData.stations[section.split('-')[1]].lat),
            });
            for(let i in this.lineFile.route.up){
                node = this.lineFile.route.up[i];
                if(node.type == "station"){
                    if(node.name.includes(" ")){
                        node.name = node.name.replaceAll(" ", "");
                    }
                    let nearbyWaypoint;
                    if(i == 0){
                        nearbyWaypoint = this.lineFile.route.up[1];
                    }else{
                        nearbyWaypoint = this.lineFile.route.up[i-1];
                    }
                    node.lng = nearbyWaypoint.lng;
                    node.lat = nearbyWaypoint.lat;
                }
            }
            this.loadLine();
            this.showMessage(["读取线路", "", "读取现有线路内容成功~"]);
        },
        loadLine(lineFile = null) {
            if(lineFile){
                this.lineFile = deepClone(lineFile);
            }
            if(this.lineFile.fileVersion > 1){
                this.showMessage(["读取线路", "", "当前打开的是高版本 BLD 所使用的新版文件格式。\n当前版本的 BLD 可能无法解析新版本线路文件。", false]);
            }
            this.undoable = false;
            this.$refs.tabStation.loadLine();
        },

        loadRegions(data){
            data = data.match(/^\*\*YGKJ(.*)YGKJ##$/)[1];
            try{
                JSON.parse(data).jsonr.data.cities.forEach(city => {
                    var province = city.cityProvince.replace('省', '');
                    if(province == '新绛') province = '新疆';
                    if(province !== ''){
                        if(!this.regions.hasOwnProperty(province)){
                            this.regions[province] = {name: province, cities: []};
                        }
                        this.regions[province].cities.push({name: city.cityName, id: city.cityId});
                    }
                });
                if(!JSON.parse(data).jsonr.data.cities.length){
                    throw "没有获取到数据";
                }
            }catch(e){
                modalLineSearch.CitiesLoadingPrompt = '加载失败: ' + e + '，请刷新页面后再试';
            }
        },

        loadLineFromFile(){
            try{
                this.lineFile = deepClone(this.blankLineFile);
                deepCopy(this.lineFile, JSON.parse(this.fileReader.result));
            }catch(e){
                this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);
                return;
            }
            this.loadLine();
        },
        uploadLine() {
            this.showModalConfirm("读取线路", "确定读取线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.getFile);
        },
        getFile() {
            if(document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                this.fileInput.dispatchEvent(event);
            }
            else {
                this.fileInput.click();
            }
        },
        readFile() {
            if(!this.fileInput.files.length){
                return;
            }
            this.fileReader.readAsText(this.fileInput.files[0]);
        },
        loadLineFromClipboard(line){
            try{
                this.lineFile = deepClone(this.blankLineFile);
                deepCopy(this.lineFile, JSON.parse(line));
            }catch(e){
                this.showMessage(["读取线路", "", "读取线路失败: " + e, false]);
                return;
            }
            this.loadLine();
            this.showMessage(["读取线路", "", "读取剪贴板中的线路成功~"]);
        },
        newLine() {
            this.showModalConfirm("新建线路", "确定新建线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.loadBlankLine);
        },
        loadBlankLine(){
            this.lineFile = deepClone(this.blankLineFile);
            this.loadLine();
            this.showMessage(["新建线路", "", "新建空白线路成功~"]);
        },
        downloadLine() {
            this.showMessage(["保存线路", "", "正在尝试保存线路到文件，如保存失败，请尝试保存到剪贴板。", false]);
            downloadFile(
                (this.lineFile.lineName.length?this.lineFile.lineName:'未命名线路') + '.bll',
                JSON.stringify(this.lineFile),
                "application/json"
            );
        },
        copyLine() {
            this.showMessage(['保存线路', '', '线路信息已保存至剪贴板~']);
        },
        copyLineFailed() {
            this.showMessage(['保存线路', '', '线路信息保存失败，请手动复制：'.JSON.stringify(lineFile)]);
        },
        pasteLine() {
            this.showModalConfirm("读取线路", "确定读取线路吗？现有线路内容将丢失，请确保已保存当前线路哦~", this.getLineFromClipboard);
        },
        getLineFromClipboard(){
            this.showMessage(["读取线路", "", "正在尝试从剪贴板读取线路，如读取失败，请尝试将内容保存到文件中，再从文件读取。", false]);
            navigator.clipboard.readText().then(this.loadLineFromClipboard);
        },
        showModalConfirmForComponents(data){
            this.showModalConfirm(data.title, data.content, data.execute);
        },
        showModalConfirm(title, content, execute){
            this.modalConfirm.title = title;
            this.modalConfirm.content = content;
            document.getElementById("modalConfirmOK").onclick = execute;
            var m = new bootstrap.Modal(document.getElementById("modalConfirm"));
            m.show();
        },
        showModalLineSearch(){
            this.modalLineSearch.lineName = '';
            // this.modalLineSearch.city = '';
            var m = new bootstrap.Modal(document.getElementById("modalLineSearch"));
            m.show();
        },
        showMessage(data) {
            this.toast.title = data[0];
            this.toast.subtitle = data[1];
            this.toast.content = data[2];
            this.toast.autohide = false; // 将就一下
            // this.toast.autohide = data.length == 4 ? data[3] : true;
            // TODO: ⬆⬇这种写法貌似偶尔会导致显示不出来，下次一定改
            var t = new bootstrap.Toast(document.getElementById("liveToast"));
            t.show();
        },
    },
    watch: {
        settings: {
            handler(newVal){
                localStorage.setItem('settings', JSON.stringify(newVal));
                try{
                    this.$refs.tabStation.loadMapLine(false, false);
                }catch(e){};
            },
            immediate: false,
            deep: true
        }
    }
});

bld.config.errorHandler = (err, vm, info) => {
    alert(err);
};