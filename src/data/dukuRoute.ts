// ─── 独库公路完整路书数据 ───
// Duku Highway Roadbook — 独山子 → 库车，翻越天山

export interface Stop {
  type: 'viewpoint' | 'attraction' | 'rest' | 'photo';
  name: string;
  lat: number;
  lng: number;
  description: string;
  duration: string;  // 建议停留时间
  tips?: string;
}

export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  mustTry?: string;
  avgPrice: string;
}

export interface Accommodation {
  name: string;
  type: 'hotel' | 'guesthouse' | 'camp' | 'hostel';
  priceRange: string;
  description: string;
  tip?: string;
}

export interface DayRoute {
  dayNumber: number;
  title: string;           // e.g. "独山子 → 乔尔玛"
  subtitle: string;        // e.g. "穿越哈希勒根达坂"
  distanceKm: number;
  drivingTimeMin: number;
  elevation: {
    start: number;         // 出发海拔(m)
    end: number;           // 到达海拔(m)
    max: number;           // 最高点海拔(m)
    maxPoint: string;      // 最高点名称
  };
  description: string;     // 当日概述
  route: {
    from: string;
    to: string;
    via: string[];         // 途经主要地点
  };
  stops: Stop[];           // 沿途停靠点
  meals: Meal[];           // 推荐餐饮
  accommodation: Accommodation[]; // 推荐住宿
  roadCondition: string;   // 路况说明
  warnings: string[];      // 注意事项
  highlight: string;       // 当日亮点（一行字）
}

export interface RouteMeta {
  id: string;
  name: string;
  subtitle: string;
  region: string;
  totalDistanceKm: number;
  totalDays: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestSeason: string;
  seasonMonths: string;
  highestPoint: { name: string; elevation: number };
  startPoint: { name: string; lat: number; lng: number };
  endPoint: { name: string; lat: number; lng: number };
  description: string;
  highlights: string[];
  packingTips: string[];
  budget: {
    economy: number;
    comfort: number;
    luxury: number;
    perPerson: boolean;
    includes: string[];
    excludes: string[];
  };
}

export const dukuRouteMeta: RouteMeta = {
  id: 'duku-highway',
  name: '独库公路',
  subtitle: '纵贯天山脊梁的景观大道',
  region: '新疆',
  totalDistanceKm: 561,
  totalDays: 4,
  difficulty: 'moderate',
  bestSeason: '6月—9月',
  seasonMonths: '每年6月初至9月底开放，10月至次年5月封路',
  highestPoint: { name: '哈希勒根达坂', elevation: 3400 },
  startPoint: { name: '独山子', lat: 44.3272, lng: 84.8835 },
  endPoint: { name: '库车', lat: 41.7179, lng: 82.9623 },
  description: '独库公路，国道217线独山子至库车段，全长561公里，纵贯天山南北。'
    + '它连接北疆与南疆，翻越哈希勒根、玉希莫勒盖、铁力买提三座达坂，'
    + '横跨峡谷、雪山、草原、雅丹、丹霞等多种地貌。'
    + '被《中国国家地理》评为"中国最美公路"之一，是自驾爱好者此生必驾的路线。',
  highlights: [
    '一日看尽四季——从峡谷到雪山到草原到丹霞',
    '翻越三座海拔3000米以上的达坂',
    '独山子大峡谷——"独库秘境，亿年奇观"',
    '乔尔玛烈士陵园——致敬168名筑路英雄',
    '那拉提草原——空中草原，瑞士风光',
    '巴音布鲁克——九曲十八弯的落日',
    '天山神秘大峡谷——红色雅丹奇观',
  ],
  packingTips: [
    '防晒三件套：墨镜、帽子、防晒霜（高原紫外线极强）',
    '保暖衣物：即使7月，达坂上也可能降至0°C',
    '身份证、驾驶证、行驶证——检查站频繁',
    '离线地图下载——山区无信号',
    '便携氧气瓶——翻越达坂时海拔超3000米',
    '零食和水——沿途补给点少',
  ],
  budget: {
    economy: 1680,
    comfort: 3280,
    luxury: 5200,
    perPerson: true,
    includes: ['住宿', '餐饮', '油费+过路费', '景点门票'],
    excludes: ['往返大交通', '购物', '车辆维修'],
  },
};

export const dukuDays: DayRoute[] = [
  {
    dayNumber: 1,
    title: '独山子 → 乔尔玛',
    subtitle: '翻越哈希勒根达坂',
    distanceKm: 136,
    drivingTimeMin: 180,
    elevation: { start: 500, end: 2200, max: 3400, maxPoint: '哈希勒根达坂' },
    description: '从独山子出发，正式进入独库公路。第一天的核心是翻越海拔3400米的哈希勒根达坂。'
      + '沿途你将看到峡谷、雪山、防雪走廊，路况以盘山公路为主，弯多坡陡，需要谨慎驾驶。'
      + '到达乔尔玛后，一定要去烈士陵园——168名官兵为修建这条公路献出了生命。',
    route: {
      from: '独山子',
      to: '乔尔玛',
      via: ['独山子大峡谷', '守望天山观景台', '老虎口', '天瀑', '哈希勒根达坂', '防雪长廊'],
    },
    stops: [
      {
        type: 'attraction',
        name: '独山子大峡谷',
        lat: 44.3833, lng: 84.8000,
        description: '天山雪水亿万年冲刷形成的峡谷奇观，谷壁陡峭如刀削斧劈，拥有"独库秘境，亿年奇观"之誉。谷底最窄处仅几米，两岸落差达200米。',
        duration: '1—1.5小时',
        tips: '门票¥30。清晨或傍晚光线最佳，适合航拍。峡谷边有玻璃桥（¥80），胆子大的可以试试。',
      },
      {
        type: 'viewpoint',
        name: '守望天山观景台',
        lat: 44.2000, lng: 84.6500,
        description: '独库公路标志性观景台，一块刻有"守望天山"的巨石，背后是巍峨的天山雪峰。几乎所有走独库的人都会在这里拍一张打卡照。',
        duration: '20分钟',
        tips: '人很多，想拍到没人的照片要早到。',
      },
      {
        type: 'photo',
        name: '天瀑',
        lat: 43.9500, lng: 84.4500,
        description: '高山瀑布从悬崖上飞泻而下，夏季水量充沛时非常壮观。瀑布旁有停车区，可以近距离观赏。',
        duration: '15—20分钟',
      },
      {
        type: 'viewpoint',
        name: '哈希勒根达坂',
        lat: 43.8500, lng: 84.3500,
        description: '独库公路最高点之一，海拔3400米。垭口常年积雪，即使7月也能看到冰川和雪墙。这里有停车区和简单的服务设施。',
        duration: '30分钟',
        tips: '海拔高，走几步就会喘，不要剧烈运动。注意保暖，垭口气温可能只有5°C。',
      },
    ],
    meals: [
      {
        name: '独山子市区早餐',
        type: 'breakfast',
        description: '出发前在独山子吃一顿扎实的早餐。推荐拌面或抓饭，为一天的山路储备能量。',
        mustTry: '过油肉拌面',
        avgPrice: '¥15-25',
      },
      {
        name: '乔尔玛服务区午餐',
        type: 'lunch',
        description: '乔尔玛有服务区，提供简单的拌面、烤肉、馕。条件有限但能吃饱。',
        mustTry: '羊肉串 + 馕',
        avgPrice: '¥30-50',
      },
      {
        name: '乔尔玛住宿点晚餐',
        type: 'dinner',
        description: '晚上在乔尔玛或附近的蒙古包营地吃清炖羊肉或大盘鸡，分量足，味道正宗。',
        mustTry: '大盘鸡',
        avgPrice: '¥60-100',
      },
    ],
    accommodation: [
      {
        name: '乔尔玛旅游接待中心',
        type: 'hotel',
        priceRange: '¥200-350/晚',
        description: '乔尔玛条件最好的住宿，有标准间和热水，房间有限需要提前预订。',
        tip: '旺季（7-8月）建议提前2周订。',
      },
      {
        name: '哈萨克蒙古包营地',
        type: 'camp',
        priceRange: '¥100-200/人',
        description: '体验草原牧民生活，睡蒙古包（毡房），主人会做地道的哈萨克美食。',
        tip: '没有独立卫生间，公共厕所，介意勿选。但星空无敌。',
      },
    ],
    roadCondition: '全程柏油路，但弯多坡陡，部分路段有落石风险。哈希勒根达坂附近夏季也可能有积雪或结冰。',
    warnings: [
      '出发前检查刹车和轮胎——下坡路段多且长',
      '达坂海拔3400米，有高原反应可能——带氧气瓶',
      '山区天气多变，晴天突然下雨下雪是常事',
      '加油站：独山子加满油，乔尔玛无加油站',
    ],
    highlight: '哈希勒根达坂——站在3400米看雪山就在手边',
  },
  {
    dayNumber: 2,
    title: '乔尔玛 → 那拉提',
    subtitle: '穿行百里画廊',
    distanceKm: 146,
    drivingTimeMin: 210,
    elevation: { start: 2200, end: 1800, max: 3200, maxPoint: '玉希莫勒盖达坂' },
    description: '第二天翻越玉希莫勒盖达坂，进入伊犁河谷。这一段被称为"百里画廊"——'
      + '唐布拉草原的绿色一路延伸到天际，雪山在远处若隐若现。'
      + '下午到达那拉提草原，这是世界四大高山草原之一，你可以选择骑马或徒步进入草原深处。',
    route: {
      from: '乔尔玛',
      to: '那拉提',
      via: ['乔尔玛烈士陵园', '唐布拉草原', '玉希莫勒盖达坂', '零公里', '那拉提草原'],
    },
    stops: [
      {
        type: 'attraction',
        name: '乔尔玛烈士陵园',
        lat: 43.6500, lng: 84.3000,
        description: '独库公路修建于1974-1983年，168名官兵因雪崩、塌方、疾病献出了生命。守墓人陈俊贵（一位老兵）几十年如一日守护着战友的墓碑。来到这里，请肃立默哀。',
        duration: '30-40分钟',
        tips: '免费参观。可以和守墓老兵聊聊天，他的故事让人动容。',
      },
      {
        type: 'viewpoint',
        name: '唐布拉草原（百里画廊）',
        lat: 43.5800, lng: 84.1500,
        description: '唐布拉草原是独库公路最精华的路段之一，全长百余公里，被称为"百里画廊"。喀什河在草原上蜿蜒，哈萨克牧民的毡房点缀其间，夏季野花遍地。',
        duration: '沿途随时停车拍照',
        tips: '看到安全停车区就停下来，每一帧都是壁纸。注意不要随意碾压草场。',
      },
      {
        type: 'viewpoint',
        name: '玉希莫勒盖达坂',
        lat: 43.4500, lng: 84.0500,
        description: '第二座达坂，海拔3200米。垭口处可以看到冰川退却后留下的U型谷和角峰地貌，地质爱好者狂喜。',
        duration: '20分钟',
      },
      {
        type: 'attraction',
        name: '那拉提草原',
        lat: 43.3500, lng: 83.9500,
        description: '世界四大高山河谷草原之一，分为河谷草原和空中草原两个景区。空中草原海拔2200米，四面雪山环抱，夏季绿草如茵，野花似锦。',
        duration: '3-4小时',
        tips: '门票¥95（含区间车¥135）。推荐空中草原线。骑马¥80/小时。建议下午4点前进入，光线最美。',
      },
    ],
    meals: [
      {
        name: '途中牧民家',
        type: 'lunch',
        description: '唐布拉草原沿途有哈萨克牧民开设的小餐馆，现宰的羊肉串和手抓饭，味道远超城市里的任何餐厅。',
        mustTry: '现烤羊肉串 + 手抓饭',
        avgPrice: '¥40-60',
      },
      {
        name: '那拉提镇晚餐',
        type: 'dinner',
        description: '那拉提镇餐馆众多，以哈萨克和回族风味为主。推荐马肉纳仁——这是伊犁地区的特色。',
        mustTry: '马肉纳仁、清炖羊肉',
        avgPrice: '¥60-100',
      },
    ],
    accommodation: [
      {
        name: '那拉提镇酒店',
        type: 'hotel',
        priceRange: '¥250-500/晚',
        description: '镇上酒店选择多，从经济型到精品民宿都有。旺季价格翻倍。',
      },
      {
        name: '那拉提草原民宿',
        type: 'guesthouse',
        priceRange: '¥300-600/晚',
        description: '住在草原边上，推窗就是雪山草原。条件好、有独立卫浴、含早餐。',
        tip: '首推"那拉提沐山"和"草原石人"两家。',
      },
    ],
    roadCondition: '柏油路为主，部分路段较窄。百里画廊段路况好，但注意路边随时可能窜出牛羊。',
    warnings: [
      '百里画廊段风景太美，司机不要分心看风景——让副驾驶拍照',
      '那拉提草原海拔1800-2200米，走路慢一点',
      '草原天气多变，带雨具',
    ],
    highlight: '唐布拉百里画廊——100公里的绿色画卷',
  },
  {
    dayNumber: 3,
    title: '那拉提 → 巴音布鲁克',
    subtitle: '邂逅九曲落日',
    distanceKm: 90,
    drivingTimeMin: 120,
    elevation: { start: 1800, end: 2500, max: 2700, maxPoint: '拉尔墩达坂' },
    description: '第三天是全程最短、最轻松的一天。从那拉提到巴音布鲁克只需2小时车程，'
      + '你可以悠闲地出发，下午到达巴音布鲁克大草原——中国第二大草原。'
      + '核心体验是傍晚站在九曲十八弯的观景台上，看落日在水面上反射出九个太阳的奇观。',
    route: {
      from: '那拉提',
      to: '巴音布鲁克',
      via: ['拉尔墩达坂', '巩乃斯河谷', '巴音布鲁克草原', '九曲十八弯'],
    },
    stops: [
      {
        type: 'viewpoint',
        name: '拉尔墩达坂',
        lat: 43.2500, lng: 84.0000,
        description: '第三座达坂，海拔较低（2700米），但视野极为开阔。站在垭口可以看到天山雪峰一字排开，气势磅礴。',
        duration: '20分钟',
      },
      {
        type: 'rest',
        name: '巩乃斯河谷',
        lat: 43.2000, lng: 84.1000,
        description: '沿巩乃斯河前行，河谷两岸是茂密的雪岭云杉森林，河水清澈见底。可在河边停车休息、戏水。',
        duration: '30分钟（可选）',
        tips: '河水是雪融水，冰凉刺骨，夏天泡泡脚很舒服。',
      },
      {
        type: 'attraction',
        name: '巴音布鲁克草原',
        lat: 43.0500, lng: 84.1000,
        description: '中国第二大草原，面积2.3万平方公里。《飞驰人生》取景地。草原开阔平坦，天鹅湖和九曲十八弯是两大核心景点。',
        duration: '4-5小时（含看日落）',
        tips: '门票¥140（含区间车）。日落时间夏季约21:30-22:00（新疆用北京时间但实际有时差），提前1小时到达占好位置。',
      },
      {
        type: 'photo',
        name: '九曲十八弯',
        lat: 43.0000, lng: 84.1000,
        description: '开都河在草原上蜿蜒出完美的S形曲线。日落时分，阳光在水面反射，运气好的话能看到"九个太阳"的奇观——九个太阳同时映在九段河曲中。',
        duration: '1.5小时（等日落）',
        tips: '最佳观赏时间：6-8月傍晚约21:00-22:00。观景台上风大且冷，穿羽绒服不夸张。带长焦镜头！',
      },
    ],
    meals: [
      {
        name: '途中野餐（推荐）',
        type: 'lunch',
        description: '在那拉提出发前买好馕、水果、酸奶，在巩乃斯河边找个风景好的地方野餐。这是自驾最享受的时刻。',
        avgPrice: '¥20-30',
      },
      {
        name: '巴音布鲁克镇晚餐',
        type: 'dinner',
        description: '看完日落已经晚上10点了，镇上餐厅大多还开着。推荐黑头羊肉——巴音布鲁克特有的品种，肉质鲜嫩无膻味。',
        mustTry: '黑头羊肉火锅',
        avgPrice: '¥80-150',
      },
    ],
    accommodation: [
      {
        name: '巴音布鲁克镇酒店',
        type: 'hotel',
        priceRange: '¥200-500/晚',
        description: '镇上住宿选择有限，旺季非常紧张。条件普遍一般，但干净。',
        tip: '旺季一定要提前订！否则可能只能睡车上。',
      },
      {
        name: '草原蒙古包',
        type: 'camp',
        priceRange: '¥150-250/人',
        description: '住在草原上的蒙古包里，晚上看星空。但条件简陋，夜里冷。',
        tip: '带睡袋——草原之夜气温可降至5°C以下。',
      },
    ],
    roadCondition: '全程柏油路，路况好。注意限速，草原路段有交警流动测速。',
    warnings: [
      '巴音布鲁克海拔2500米，晚上气温骤降——带厚衣服',
      '看日落人多，提前占位置',
      '草原蚊子多——带驱蚊水',
      '镇上住宿极度紧张，务必提前订',
    ],
    highlight: '九曲十八弯落日——看到九个太阳需要运气，但一个太阳已经足够震撼',
  },
  {
    dayNumber: 4,
    title: '巴音布鲁克 → 库车',
    subtitle: '从草原到峡谷',
    distanceKm: 257,
    drivingTimeMin: 300,
    elevation: { start: 2500, end: 1000, max: 3200, maxPoint: '铁力买提达坂' },
    description: '最后一天是全程最长、地貌变化最剧烈的一天。'
      + '你将翻越铁力买提达坂，从北疆的高山草原一路下到南疆的干旱戈壁。'
      + '沿途经过大小龙池、天山神秘大峡谷，最终到达龟兹故城——库车。'
      + '这一天你将亲眼见证"北疆看风景，南疆看风情"的地理分界线。',
    route: {
      from: '巴音布鲁克',
      to: '库车',
      via: ['铁力买提达坂', '大龙池', '小龙池', '天山神秘大峡谷', '库车老城'],
    },
    stops: [
      {
        type: 'viewpoint',
        name: '铁力买提达坂',
        lat: 42.6000, lng: 83.5000,
        description: '独库公路最后一座达坂，海拔3200米，隧道穿过天山分水岭。穿过隧道的那一刻，眼前的地貌立刻从草原变成荒漠——这就是天山南北的分界线。',
        duration: '15-20分钟',
        tips: '隧道内无灯、狭窄、会车需小心。出了隧道就正式进入南疆。',
      },
      {
        type: 'viewpoint',
        name: '大龙池',
        lat: 42.4500, lng: 83.3000,
        description: '天山南麓的高山湖泊，湖水碧蓝如翡翠，周围是墨绿色的云杉林。小龙池在大龙池下方不远处，更小更秀气。',
        duration: '30分钟',
        tips: '免费，路边停车即可观赏。推荐用无人机拍摄，湖水的蓝色非常上镜。',
      },
      {
        type: 'attraction',
        name: '天山神秘大峡谷',
        lat: 42.1000, lng: 83.0000,
        description: '红色雅丹地貌峡谷，全长约5公里，谷壁高耸如墙。阳光照在红色岩壁上，整个峡谷燃烧般通红。由红褐色岩石经亿万年风蚀雨剥形成。',
        duration: '1.5—2小时',
        tips: '门票¥41。中午阳光直射时最红最美。穿防滑鞋，谷底有细沙和碎石。偶尔会因降雨临时关闭（谷内会积水）。',
      },
      {
        type: 'attraction',
        name: '库车老城',
        lat: 41.7179, lng: 82.9623,
        description: '龟兹故城，丝绸之路上的重要节点。热斯坦路上彩色的木门、库车大寺、库车王府，充满浓郁的维吾尔风情。独库公路走完，这里是庆祝的最佳地点。',
        duration: '1—2小时',
        tips: '热斯坦路是拍照圣地，彩色木门每扇都不一样。库车大馕城的馕有脸盆那么大——买一个挂在车上当旅行勋章。',
      },
    ],
    meals: [
      {
        name: '大龙池服务区',
        type: 'lunch',
        description: '大龙池旁有服务区，提供简单的拌面和烤肉。条件一般，但这是独库公路南段唯一的补给点。',
        avgPrice: '¥30-50',
      },
      {
        name: '库车夜市（胜利晚餐）',
        type: 'dinner',
        description: '库车的夜市是整个南疆最棒的之一。烤鸽子、缸子肉、馕坑肉、库车大馕……用一顿正宗南疆美食庆祝走完独库！',
        mustTry: '烤鸽子、缸子肉、库车大馕',
        avgPrice: '¥60-120',
      },
    ],
    accommodation: [
      {
        name: '库车市区酒店',
        type: 'hotel',
        priceRange: '¥200-500/晚',
        description: '库车是县级市，酒店选择丰富，从经济型到五星都有。推荐住在老城附近方便吃饭和逛逛。',
      },
      {
        name: '库车饭店（老牌）',
        type: 'hotel',
        priceRange: '¥300-600/晚',
        description: '库车老牌酒店，设施标准，位置好，早餐丰富。',
      },
    ],
    roadCondition: '铁力买提达坂段弯多坡陡；进入南疆后路况变好但气温骤升，注意车辆散热。独库公路终点有大型停车场和打卡纪念碑。',
    warnings: [
      '最后一天驾驶时间最长（5小时+），前一天晚上休息好',
      '铁力买提隧道内无灯、狭窄、可能有暗冰——减速慢行',
      '进入南疆后气温从草原的15°C飙升到戈壁的35°C+——准备好换衣服',
      '天山神秘大峡谷如遇雨天会关闭——提前查天气',
      '库车是南疆重要城市，治安很好，但尊重当地民族风俗',
    ],
    highlight: '穿过铁力买提隧道——前一秒是北欧，后一秒是中东',
  },
];
