// =====================================================================
// 个人资料总配置 —— 站点所有文字与数据均来自本文件
// ★ 修改本文件保存后整站全局生效；也可在网站右上角开启「编辑模式」，
//   直接在页面上修改文字、更换图片（修改保存在浏览器本地，可用
//   「导出修改」下载成 JSON，再粘贴回本文件即可永久生效）。
// ★ 作品图片在 public/assets/works/ 下：替换同名文件，或新增图片后
//   同步修改 works 数组中的 image 路径。
// =====================================================================

export const profile = {
  /* ---------- 基本信息 ---------- */
  name: '彭文凯',              // 姓名（中文）
  nameEn: 'PENG WENKAI',       // 姓名（英文）
  role: '平面视觉设计师',       // 职业身份（Hero 大标题）
  roleEn: 'GRAPHIC / VISUAL DESIGNER',
  heroEn: 'VISUAL DESIGNER',   // Hero 大标题英文（渐变字）
  greeting: 'HELLO / 你好',    // Hero 问候语
  heroYear: 'PORTFOLIO / 2026',
  ctaText: '与我合作',          // 导航栏按钮文案
  tagline: '以平面视觉为原点，用 AIGC 放大创意——让每一帧画面都有生命力',

  /* ---------- 个人形象（关于区背景行走角色，透明抠图 + 打招呼交互） ---------- */
  walker: {
    img1: './assets/works/char-trend-1.png', // 行走第 1 帧（透明底）
    img2: './assets/works/char-trend-2.png', // 行走第 2 帧（透明底）
    wave: './assets/works/char-wave.png',    // 挥手打招呼（透明底）
    hello: '你好！',                          // 鼠标悬停时显示的问候语
  },

  /* ---------- 作品分类（可在编辑模式中添加新分类） ---------- */
  categories: ['全部', '品牌', '海报', '插画', 'UI'],

  /* ---------- 联系方式（页尾模块） ---------- */
  email: '1326442341@qq.com',
  phone: '157-1857-8373',     // 电话：15718578373
  school: '天津理工大学 · 视觉传达设计',
  location: '中国 · 天津',

  /* ---------- 社交平台（可替换为你的主页链接） ---------- */
  socials: [
    { label: '站酷', url: 'https://www.zcool.com.cn' },
    { label: 'Behance', url: 'https://www.behance.net' },
    { label: '小红书', url: 'https://www.xiaohongshu.com' },
    { label: '即刻', url: 'https://web.okjike.com' },
  ],

  /* ---------- 个人介绍（个人经历模块） ---------- */
  intro: [
    '天津理工大学视觉传达设计本科在读，系统学习品牌设计、海报版式、插画与 UI/UX 等方向；同时深耕 AIGC 美术，拥有三段完整的商业化漫剧与短视频项目实战经验。',
    '从脚本分镜到美术交付，我习惯以系统化方式推进设计：既用 Photoshop、Illustrator 打磨每一个视觉细节，也借助 ComfyUI、Kling 等工具搭建稳定产出管线，让创意高效落地为成片与画面。',
  ],
  signature: '—— 用画面讲好故事，让视觉自带生命力',

  /* ---------- 项目数据（数字统计，源自简历） ---------- */
  stats: [
    { value: 3, suffix: '段', label: '行业实习经历' },
    { value: 3, suffix: '年', label: '视觉传达学习' },
    { value: 9, suffix: '门', label: '核心专业课程' },
    { value: 5, suffix: '类', label: '作品方向覆盖' },
  ],

  /* ---------- 个人优势：能力模型（雷达图 + 进度条） ---------- */
  skills: [
    { name: 'AIGC 美术', value: 92 },
    { name: '品牌视觉', value: 90 },
    { name: '海报版式', value: 88 },
    { name: '插画图形', value: 85 },
    { name: '动态视觉', value: 85 },
    { name: 'UI/UX', value: 82 },
  ],

  /* ---------- 常用工具 ---------- */
  tools: ['Photoshop', 'Illustrator', 'Premiere Pro', 'Figma', 'ComfyUI', 'Kling', 'Vidu', '即梦'],

  /* ---------- 作品集（项目展示模块，全部 28 幅，横屏滚动） ----------
   * aspect : 卡片图片比例（宽/高）
   * note   : 设计说明（200 字以内，展示在图片下方）
   * 修改作品：替换 public/assets/works/ 对应图片，或新增图片后同步修改这里的
   * 标题 / 分类 / 年份 / 一句话简介 / 设计说明 / 图片路径
   */
  works: [
    {
      id: 'mooli',
      title: 'mooli 品牌视觉识别手册',
      category: '品牌',
      year: '2026',
      desc: '为「Design for Connection」的友好生活品牌构建完整 VI。',
      note: '围绕「用设计传递友好，让世界更有温度」的品牌理念，为 mooli 构建了从标志、标准色、字体、辅助图形到吉祥物、包装与数字界面的完整视觉体系。标志采用圆润友好的字形与连接式负空间设计，色彩温暖明快，17 大板块规范确保品牌在多场景下保持一致、可延展的视觉形象。',
      image: './assets/works/work-mooli.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'timescent',
      title: '「时光の香」国风香水海报',
      category: '海报',
      year: '2025',
      desc: '水墨山水与罗盘元素交织的东方香调叙事。',
      note: '以「天圆地方」为灵感，将水墨山水、罗盘与香料图形融入海报，瓶身造型取自方与圆的对话。画面以留白与淡墨营造东方意境，香调信息以传统竖排文字呈现，整体兼具商业信息传达与国风审美气质。',
      image: './assets/works/work-timescent.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'petapp',
      title: '「汪星守护」宠物健康 App 全案',
      category: 'UI',
      year: '2025',
      desc: '宠物健康管理 App：柯基 IP 与暖橙系产品体验。',
      note: '面向宠物家庭的健康管理产品。以柯基 IP 拉近情感距离，暖橙色系传递温暖关怀；完整设计了启动页、图标、组件规范与核心功能页，从记录、提醒到社区互动，构建可落地的全链路产品体验。',
      image: './assets/works/work-petapp.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'inkrhyme',
      title: '「墨韵新聲」艺术展海报',
      category: '海报',
      year: '2024',
      desc: '新中式水墨展视觉：墨色凤凰与金箔交融。',
      note: '为当代水墨艺术展设计的视觉主视觉。墨色凤凰与金箔元素交融，象征传统笔墨在现代语境中的新生；「墨韵新聲」与英文副标对仗排布，展出信息清晰分层，兼顾文化底蕴与展览传播功能。',
      image: './assets/works/work-inkrhyme.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'lumo',
      title: 'LUMO 品牌视觉识别手册',
      category: '品牌',
      year: '2026',
      desc: '蓝黄主色与插画系统的年轻品牌 VI。',
      note: '为年轻生活品牌 LUMO 打造「点亮每一刻」的视觉系统：蓝黄主色代表理性与活力，标志简洁锐利，插画系统统一品牌叙事，覆盖办公、包装、数字等多场景应用规范，帮助品牌快速建立识别度。',
      image: './assets/works/work-lumo.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'reading',
      title: '「阅读让世界更大」主题插画',
      category: '插画',
      year: '2025',
      desc: '蓝鲸驮城堡遨游云海的奇幻阅读场景。',
      note: '以「一本书·一场新的远方」为叙事核心，描绘蓝鲸驮着城堡遨游云海的奇幻场景，红帽女孩坐在书堆上阅读，罗盘、地图与飞鸟隐喻探索与想象。青绿色调梦幻清新，将阅读的辽阔感视觉化。',
      image: './assets/works/work-reading.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'goodtrip',
      title: 'GOOD TRIP 旅行涂鸦插画',
      category: '插画',
      year: '2025',
      desc: '波普涂鸦风格的自由旅行态度。',
      note: '波普涂鸦风格记录「说走就走」的旅行态度。旅行者戴耳机墨镜、手持相机，哈士奇与房车、雪山构成假日图景；路标「CITY/MOUNTAIN/SEA/FREEDOM」与勾选清单强化自由探索的情绪。',
      image: './assets/works/work-goodtrip.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'aurora',
      title: 'AURORA HARVEST 品牌 VI',
      category: '品牌',
      year: '2025',
      desc: '可持续农业品牌的全套视觉识别。',
      note: '为可持续有机农业品牌建立完整视觉识别：融合花卉、叶片与太阳的品牌标志传达自然生机，浅米色系与衬线字体现高端有机质感，从包装、摄影、网站到门店环境形成统一规范。',
      image: './assets/works/work-aurora.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'senbreathe',
      title: '「森呼吸」情绪治愈 App 全案',
      category: 'UI',
      year: '2025',
      desc: '情绪记录 × 植物养成的治愈系产品。',
      note: '情绪记录与植物养成结合的自愈系产品。用户通过记录情绪、照料植物获得反馈与陪伴；从 IP 形象、插画、图标到交互流程、动效与周边，全程暖橙绿配色，把「被治愈」做成完整体验。',
      image: './assets/works/work-senbreathe.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'creativelife',
      title: 'CREATIVE LIFE 街头涂鸦插画',
      category: '插画',
      year: '2025',
      desc: '高饱和撞色记录创意生活的灵感瞬间。',
      note: '高饱和撞色与张扬笔触描绘创意青年的日常：红帽少年与黑猫被书籍、相机与灵感便签环绕，「GOOD IDEAS MAKE BETTER DAYS」等标语强化积极追梦的街头文化气质。',
      image: './assets/works/work-creativelife.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'herbcity',
      title: '「草药治愈城市」展览海报',
      category: '海报',
      year: '2024',
      desc: '植物建筑学 × 健康居住的主题展视觉。',
      note: '为「植物建筑学·健康居住」主题展设计，将草药与城市建筑轮廓融合，绿植穿行其间；「由内而外的治愈，让城市深呼吸」点题，浅米底与绿色系传递自然、健康、宜居的展览主张。',
      image: './assets/works/work-herbcity.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'pinecone',
      title: '「小松果」浣熊 IP 全案',
      category: 'UI',
      year: '2025',
      desc: '从三视图到周边与 App 界面的完整 IP 系统。',
      note: '以「小松果」浣熊为核心打造完整 IP 系统：从基础三视图、色彩字体规范，到服装造型、故事版、低保真原型、组件库、周边与 App 界面，全面示范了 IP 从角色设定到商业落地的设计路径。',
      image: './assets/works/work-pinecone.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'foodtrip',
      title: '「味旅记」美食 App 全案',
      category: 'UI',
      year: '2025',
      desc: '熊猫 IP 与六大功能模块的美食探索体验。',
      note: '面向美食探索场景的 App 设计：熊猫 IP 活泼亲切，暖橙色调激发食欲；以六大功能模块串联发现、记录与分享的美食之旅，并配套插画延展与设计规范，保证产品一致性与趣味性。',
      image: './assets/works/work-foodtrip.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'detox',
      title: '「放下手机 找回生活」海报',
      category: '海报',
      year: '2025',
      desc: '7 天数字排毒挑战：放下手机，回归生活。',
      note: '以「7 天数字排毒挑战」为主题，用轻松手绘风呈现放下手机、回归真实生活的理念。画面把手机拟作「被埋葬」的对象，右侧列出戒断收获与 20-20-20 法则，左下规划 7 天每日任务，劝导性强、信息完整。',
      image: './assets/works/work-detox.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'brain',
      title: '「让大脑充满电」主题海报',
      category: '海报',
      year: '2025',
      desc: '粉色大脑卡通：专注、高效、持续进步。',
      note: '学习励志主题插画海报，粉色大脑戴耳机、捧书本，站在书堆上充电，象征持续输入与成长；「记忆提升/思维清晰/效率翻倍」等关键词配合打卡清单，把抽象的学习方法转化为可爱可视的日常行动。',
      image: './assets/works/work-brain.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'galaxy',
      title: 'SWEET GALAXY BAKERY 品牌 VI',
      category: '品牌',
      year: '2025',
      desc: '粉紫马卡龙色系与熊厨师 IP 的烘焙品牌。',
      note: '甜蜜星系的烘焙品牌视觉：粉紫马卡龙色系营造梦幻氛围，熊厨师 IP 亲和可爱，完整覆盖标志、包装、门店物料与社交媒体模板，让甜品品牌自带童话感与传播力。',
      image: './assets/works/work-galaxy.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'sweethug',
      title: 'SWEET HUG BAKERY LAB 品牌 VI',
      category: '品牌',
      year: '2025',
      desc: '马卡龙色与面包 IP 的温暖治愈视觉。',
      note: '烘焙实验室的品牌升级：马卡龙色与面包 IP 构成温暖治愈的视觉语言，标志、辅助图形与应用系统统一又富趣味，帮助品牌在竞争激烈的烘焙赛道建立温柔、专业的差异化形象。',
      image: './assets/works/work-sweethug.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'skatechill',
      title: 'SKATE & CHILL 滑板涂鸦插画',
      category: '插画',
      year: '2025',
      desc: '小狗滑手与夕阳滑板场的轻松潮流插画。',
      note: '潮流滑板主题涂鸦：拟人小狗戴棒球帽与耳机，在夕阳滑板场举着冰饮「chill」一下；黄粉青黑高饱和配色与「LIFE IS BETTER ON A BOARD」标语，传递轻松随性的街头生活方式。',
      image: './assets/works/work-skatechill.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'reading2',
      title: '「在书里遇见更大的世界」插画',
      category: '插画',
      year: '2025',
      desc: '贝雷帽女孩与云海城堡的阅读想象。',
      note: '贝雷帽女孩坐在摊开的巨书上，猫咪相伴，背景是云海中的城堡与游鲸；台灯、书堆与绿植营造阅读的仪式感，表达「阅读让想象不设限」，画面清新治愈、富有故事性。',
      image: './assets/works/work-reading2.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'sweetdream',
      title: 'SWEET DREAM CAFE 品牌 VI',
      category: '品牌',
      year: '2025',
      desc: '黑粉调与五大系统的梦幻咖啡品牌。',
      note: '梦幻咖啡店的品牌视觉系统：黑粉调与精致线条塑造夜间咖啡美学，五大系统覆盖标志、色彩、应用与空间物料，「DREAM SWEETLY, LIVE GENTLY」的品牌文案贯穿始终。',
      image: './assets/works/work-sweetdream.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'nioma',
      title: '「别看了，你才是牛马」创意海报',
      category: '海报',
      year: '2024',
      desc: '牛马戴眼镜的职场吐槽与假期宣言。',
      note: '以牛马戴眼镜的荒诞形象调侃职场生态，蓝绿色手绘与办公元素交织，镜片折射加班日常；「暂停常规，开启奇想模式」的假期主张配合 05.01-05.05 活动信息，幽默中带传播力。',
      image: './assets/works/work-nioma.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'logo-minimal',
      title: '现代简约 LOGO 合集',
      category: '品牌',
      year: '2025',
      desc: '12 枚现代简约风格品牌 LOGO 设计。',
      note: '一组成体系 logo：12 枚现代简约风格标志，以几何、留白与克制的线条塑造 VALERIAN、ORION、SÉLENE 等品牌形象，覆盖科技、时尚、家居等多行业，体现标志设计的系统化思路。',
      image: './assets/works/work-logo-minimal.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'logo-serif',
      title: '轻奢衬线 LOGO 合集',
      category: '品牌',
      year: '2025',
      desc: '15 枚轻奢衬线品牌 LOGO 设计。',
      note: '15 枚轻奢品牌标志，以衬线字体的优雅字形为核心，通过字距、衬线与金银色质感塑造 ALVORA、SOLÉA、BELVÉR 等高端品牌调性，适合美妆、香氛与精品零售场景。',
      image: './assets/works/work-logo-serif.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'coffeeanywhere',
      title: 'GOOD COFFEE ANYWHERE 海报',
      category: '海报',
      year: '2025',
      desc: '便携咖啡杯的潮流插画海报。',
      note: '便携咖啡杯拟人化设计：杯子穿着红鞋奔跑，背景蓝调做旧纹理配合城市天际线，「WORK/TRAVEL/LIFE」路标点明随时随地场景；保温保冷、防漏便携等卖点图形化呈现，活力十足。',
      image: './assets/works/work-coffeeanywhere.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'coffeecreative',
      title: 'COFFEE & CREATIVE DAY 海报',
      category: '海报',
      year: '2025',
      desc: '复古波普风咖啡创意日活动海报。',
      note: '复古波普风活动海报：戴墨镜的咖啡杯踩着滑板手持画笔，米黄底搭配粉黄蓝黑撞色，创意元素环绕；时间、地点、票价与活动内容信息完整，整体传达「唤醒创意」的派对氛围。',
      image: './assets/works/work-coffeecreative.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'skatefest',
      title: 'URBAN SKATE FEST 滑板节海报',
      category: '插画',
      year: '2025',
      desc: '滑手与黑猫的都市滑板节主视觉。',
      note: '都市滑板节主视觉：滑手与黑猫、涂鸦滑板构成街头叙事，皇冠元素贯穿服装、饮品与板面，蓝粉黄高饱和配色热烈自由；JUL 26-27、RIVERFRONT PARK 等活动信息清晰标注。',
      image: './assets/works/work-skatefest.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'unseen',
      title: 'EXPLORE THE UNSEEN 招募海报',
      category: '海报',
      year: '2024',
      desc: '复古科幻风的影视招募海报。',
      note: '复古科幻风影视招募海报：礼帽男子行走于漩涡光带，飞碟与星座符号点缀，米白、深红、黑配色叠加做旧质感；「探索感知的边界」的主题文案与 Casting Call 信息醒目，神秘而有张力。',
      image: './assets/works/work-unseen.jpg',
      aspect: '4 / 5',
    },
    {
      id: 'timescent-b',
      title: '「时光の香」香水海报 · 版本 B',
      category: '海报',
      year: '2025',
      desc: '同一主题下的另一版本排版尝试。',
      note: '「时光の香」系列的另一版本：延续水墨山水与罗盘元素，瓶身香材图案更简洁，前后调信息以竖排中西文对照呈现，强化限量与创立年份的收藏属性，是同一主题下的不同排版尝试。',
      image: './assets/works/work-timescent-b.jpg',
      aspect: '4 / 5',
    },
  ],
}
